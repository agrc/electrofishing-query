(function () {
    require({
        packages: [
            'agrc',
            'app',
            'dgrid',
            'dgrid1',
            'dijit',
            'dojo',
            'dojox',
            'dstore',
            'esri',
            'layer-selector',
            'moment',
            'put-selector',
            'sherlock',
            'spinjs',
            'toaster',
            'xstyle',
            {
                name: 'bootstrap',
                location: './bootstrap',
                main: 'dist/js/bootstrap'
            }, {
                name: 'jquery',
                location: './jquery/dist',
                main: 'jquery'
            }, {
                name: 'ladda',
                location: './ladda-bootstrap',
                main: 'js/ladda'
            }, {
                name: 'lodash',
                location: './lodash/dist',
                main: 'lodash'
            }, {
                name: 'stubmodule',
                location: './stubmodule',
                main: 'src/stub-module'
            }, {
                name: 'typeahead',
                location: './bootstrap3-typeahead',
                main: 'bootstrap3-typeahead'
            }
        ],
        map: {
            ladda: {
                spin: 'ladda/dist/spin'
            },
            agrc: {
                spin: 'spinjs/spin'
            }
        }
    });
}());
