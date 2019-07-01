define([
    'app/config',

    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/tasks/Geoprocessor'
], function (
    config,

    topic,
    declare,
    lang,

    Geoprocessor
) {
    return declare(null, {
        // summary:
        submitJob: function (data) {
            // summary:
            //      kicks off the gp task
            console.log('app._GPMixin:submitJob', arguments);

            if (!this.gp) {
                this.initGP(config.urls.download);
            }

            this.gp.submitJob(data);
        },
        initGP: function (url) {
            // summary:
            //      description
            // param or return
            console.log('app._GPMixin:initGP', arguments);

            this.gp = new Geoprocessor(url);
            this.own(
                this.gp.on('error', function () {
                    topic.publish(config.topics.toast, {
                        message: 'error with download service',
                        type: 'danger'
                    });
                }),
                this.gp.on('job-complete', lang.hitch(this, 'onJobComplete'))
            );
        }
    });
});
