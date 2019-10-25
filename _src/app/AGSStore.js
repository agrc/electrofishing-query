define([
    'app/config',
    'app/queryHelpers',

    'dojo/request/xhr',
    'dojo/when',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'dstore/QueryResults',
    'dstore/RequestMemory'
], function (
    config,
    queryHelpers,

    request,
    when,
    declare,
    lang,

    QueryResults,
    RequestMemory
) {
    return declare([RequestMemory], {
        // description
        //      A dstore/Store implementation for querying a arcgis server dynamic layer query service

        rangeStartParam: 'resultOffset',
        rangeCountParam: 'resultRecordCount',

        constructor: function (options) {
            // summary:
            //      set up the store
            // options: {
            //      target: String (url to feature layer (e.g. ServiceName/MapServer/0))
            //      idProperty: String
            //      outFields: String[] (defaults to '*')
            //      returnGeometry: Boolean (defaults to false)
            //      where: String
            // }
            console.log('app.AGSStore:constructor', arguments);

            let query = `
                SELECT DISTINCT
                    se.${config.fieldNames.EVENT_ID},
                    ${config.fieldNames.EVENT_DATE},
                    ${config.fieldNames.OBSERVERS},
                    l.${config.fieldNames.WaterName} as ${config.fieldNames.WaterName}_Lake,
                    l.${config.fieldNames.DWR_WaterID} as ${config.fieldNames.DWR_WaterID}_Lake,
                    l.${config.fieldNames.ReachCode} as ${config.fieldNames.ReachCode}_Lake,
                    st.${config.fieldNames.WaterName} as ${config.fieldNames.WaterName}_Stream,
                    st.${config.fieldNames.DWR_WaterID} as ${config.fieldNames.DWR_WaterID}_Stream,
                    st.${config.fieldNames.ReachCode} as ${config.fieldNames.ReachCode}_Stream,
                    se.${config.fieldNames.STATION_ID},
                    SPECIES = STUFF((SELECT DISTINCT ', ' + f.${config.fieldNames.SPECIES_CODE}
                                     FROM ${config.databaseName}.WILDADMIN.Fish_evw as f
                                     WHERE se.${config.fieldNames.EVENT_ID} = f.${config.fieldNames.EVENT_ID}
                                     FOR XML PATH ('')),
                                     1, 1, ''),
                    TYPES = STUFF((SELECT DISTINCT ', ' + eq.TYPE
                                   FROM ${config.databaseName}.WILDADMIN.Equipment_evw as eq
                                   WHERE se.${config.fieldNames.EVENT_ID} = eq.${config.fieldNames.EVENT_ID}
                                   FOR XML PATH ('')),
                                   1, 1, '')
                FROM ${config.databaseName}.WILDADMIN.SamplingEvents_evw as se

                INNER JOIN ${config.databaseName}.WILDADMIN.Fish_evw as f
                ON se.${config.fieldNames.EVENT_ID} = f.${config.fieldNames.EVENT_ID}

                INNER JOIN ${config.databaseName}.WILDADMIN.Stations_evw as s
                ON s.${config.fieldNames.STATION_ID} = se.${config.fieldNames.STATION_ID}

                LEFT OUTER JOIN ${config.databaseName}.WILDADMIN.UDWRLakes_evw as l
                ON l.${config.fieldNames.Permanent_Identifier} = s.${config.fieldNames.WATER_ID}

                LEFT OUTER JOIN ${config.databaseName}.WILDADMIN.UDWRStreams_evw as st
                ON st.${config.fieldNames.Permanent_Identifier} = s.${config.fieldNames.WATER_ID}

                WHERE ${options.where}
            `;
            console.log('grid query:', query);
            query = queryHelpers.removeIrrelevantWhiteSpace(query);

            // push options to url query and build url
            // this is using a dynamic layer so that the query can be more specific (prevents a full table scan)
            this.params = {
                f: 'json',
                layer: JSON.stringify({
                    id: options.id,
                    source: {
                        type: 'dataLayer',
                        dataSource: {
                            type: 'queryTable',
                            workspaceId: config.dynamicWorkspaceId,
                            query,
                            oidFields: options.idProperty
                        }
                    }
                }),
                outFields: '*',
                where: '1 = 1',
                returnGeometry: false,
                orderByFields: `${config.fieldNames.EVENT_DATE} DESC`
            };

            this.inherited(arguments);
        },
        parse: function (txt) {
            // summary
            //      parse JSON and flatten FeatureSet to just attributes
            console.log('app.AGSStore:parse', arguments);

            var features = JSON.parse(txt).features.map(function (f) {
                return f.attributes;
            });

            return features;
        },
        fetchRange: function (options) {
            // summary
            //      make new request to the server for features and total count
            //      called by dgrid when a new collection is set
            // options: {start: Number, end: Number}
            console.log('app.AGSStore:fetchRange', arguments);

            var requestArgs = {
                queryParams: this._renderRangeParams(options.start, options.end)
            };

            var results = this._request(requestArgs);

            return new QueryResults(results.data, {
                totalLength: when(request(this.target, {
                    method: 'POST',
                    data: lang.mixin({
                        returnCountOnly: true
                    }, this.params),
                    headers: {
                        'X-Requested-With': null
                    },
                    handleAs: 'json'
                }), function (response) {
                    return response.count;
                }),
                response: results.response
            });
        },
        _request: function (kwArgs) {
            console.log('app/AGSStore', arguments);

            // overriden from dstore/Request to switch to a POST request
            kwArgs = kwArgs || {};

            // perform the actual query
            var headers = lang.delegate(this.headers, {
                Accept: this.accepts,
                'X-Requested-With': null
            });

            if ('headers' in kwArgs) {
                lang.mixin(headers, kwArgs.headers);
            }

            var qParams = {};

            if (kwArgs.queryParams) {
                kwArgs.queryParams.forEach(function decouple(pair) {
                    var parts = pair.split('=');
                    qParams[parts[0]] = parts[1];
                });
            }

            var requestUrl = this._renderUrl();

            var response = request(requestUrl, {
                method: 'POST',
                headers,
                data: lang.mixin(qParams, this.params)
            });
            var that = this;
            var parsedResponse = response.then(function (innerResponse) {
                return that.parse(innerResponse);
            });

            return {
                data: parsedResponse.then(function (data) {
                    // support items in the results
                    var results = data.items || data;
                    for (var i = 0, l = results.length; i < l; i++) {
                        // eslint-disable-next-line no-underscore-dangle
                        results[i] = that._restore(results[i], true);
                    }

                    return results;
                }),
                total: parsedResponse.then(function (data) {
                    // check for a total property
                    var total = data.total;
                    if (total > -1) {
                        // if we have a valid positive number from the data,
                        // we can use that
                        return total;
                    }
                    // else use headers

                    return response.response.then(function (innerResponse) {
                        var range = innerResponse.getHeader('Content-Range');

                        return range && (range = range.match(/\/(.*)/)) && +range[1];
                    });
                }),
                response: response.response
            };
        },
        _renderSortParams: function (sort) {
            // summary:
            //        Constructs sort-related params to be inserted in the query string
            // sort: Object
            // {
            //     descending: Boolean
            //     property: String (field name)
            // }
            // returns: String []
            //        Sort-related params to be inserted in the query string
            var fields = sort.map(function (s) {
                return s.property + ' ' + ((s.descending) ? 'DESC' : 'ASC');
            });

            return ['orderByFields=' + fields.join(', ')];
        }
    });
});
