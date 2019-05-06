require([
    'app/config',
    'app/filters/DateFilter',

    'dojo/dom-construct'
], function (
    config,
    WidgetUnderTest,

    domConstruct
) {
    describe('app/filters/DateFilter', function () {
        var widget;
        var destroy = function (destroyWidget) {
            destroyWidget.destroyRecursive();
            destroyWidget = null;
        };

        beforeEach(function () {
            widget = new WidgetUnderTest({
                fieldName: 'FieldName',
                name: 'hello'
            }, domConstruct.create('div', null, document.body));
            widget.startup();
        });

        afterEach(function () {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function () {
            it('should create a DateFilter', function () {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('getQuery', function () {
            it('builds a where clause', function () {
                widget.fromDate.set('value', '2015-03-30');
                widget.toDate.set('value', '2015-03-27');

                var result = widget.getQuery();

                expect(result).toBe(`${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} ` +
                    `FROM ${config.databaseName}.WILDADMIN.SamplingEvents ` +
                    "WHERE FieldName >= '03/30/2015' AND FieldName <= '03/27/2015')"
                );
            });
            it('returns undefined if there are not valid dates', function () {
                expect(widget.getQuery()).toBeUndefined();
            });
        });
        describe('isValid', function () {
            it('works with no values', function () {
                widget.clear();
                expect(widget.isValid()).toBe(false);
            });
        });
    });
});
