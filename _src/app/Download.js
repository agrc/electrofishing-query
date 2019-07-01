define([
    'app/config',
    'app/queryHelpers',
    'app/_GPMixin',
    'app/_ResultsQueryMixin',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/dom-class',
    'dojo/text!app/templates/Download.html',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'ladda'
], function (
    config,
    queryHelpers,
    _GPMixin,
    _ResultsQueryMixin,

    _TemplatedMixin,
    _WidgetBase,

    domClass,
    template,
    topic,
    declare,
    lang,

    Ladda
) {
    return declare([_WidgetBase, _TemplatedMixin, _ResultsQueryMixin, _GPMixin], {
        // description:
        //      Download the currently filtered data.
        templateString: template,
        baseClass: 'download',

        // Properties to be sent into constructor

        // grid: dgrid
        grid: null,


        initSpinner: function () {
            // summary:
            //      set up the ladda spinner
            console.log('app.Download:initSpinner', arguments);

            if (!this.spinner) {
                this.spinner = Ladda.create(this.btn);
            }
        },
        onClick: function () {
            // summary:
            //      submit form
            console.log('app.Download::onClick', arguments);

            this.initSpinner();

            const noRows = () => {
                topic.publish(config.topics.toast, {
                    message: 'No records are available for download!',
                    type: 'danger'
                });
            };

            if (!this.grid.grid) {
                noRows();

                return;
            }

            this.grid.grid.collection.fetch().then(rows => {
                if (rows.length === 0) {
                    noRows();

                    return;
                }

                this.reset();
                this.spinner.start();

                this.submitJob({
                    // eslint-disable-next-line camelcase
                    Event_Ids: queryHelpers.getIdsFromGridSelection(rows, this.grid.grid.selection)
                });
            });
        },
        initGP: function () {
            console.log('app.Download:initGP', arguments);

            this.inherited(arguments);

            this.gp.on('error', this.reset.bind(this));
        },
        reset: function () {
            // summary:
            //      description
            console.log('app.Download:reset', arguments);

            domClass.add(this.linkContainer, 'hidden');
            this.spinner.stop();
        },
        onDownloadGPComplete: function (result) {
            // summary:
            //      callback for gp task
            // result: esri/tasks/ParameterValue
            console.log('app.Download:onDownloadGPComplete', arguments);

            this.link.href = result.value.url;

            domClass.remove(this.linkContainer, 'hidden');
            this.spinner.stop();
        },
        onJobComplete: function (results) {
            // summary:
            //      description
            // results: Event Object
            console.log('app.Download:onJobComplete', arguments);

            this.gp.getResultData(results.jobInfo.jobId, 'Zip_File', lang.hitch(this, 'onDownloadGPComplete'));
        }
    });
});
