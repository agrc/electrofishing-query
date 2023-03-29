/* eslint-disable no-implicit-globals, no-undef */
profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: false,
    layerOptimize: false,
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'app/App',
                'app/packages',
                'app/run',
                'dojox/gfx/filters',
                'dojox/gfx/svg',
                'dojox/gfx/svgext',
                'esri/dijit/Attribution',
                'esri/layers/LabelLayer',
                'esri/layers/VectorTileLayerImpl',
                'esri/PopupInfo',
                'esri/tasks/RelationshipQuery',
                'xstyle/core/load-css'
            ],
            includeLocales: ['en-us'],
            customBase: true,
            boot: true
        }
    },
    packages: [{
        name: 'spinjs',
        resourceTags: {
            copyOnly: function (filename, mid) {
                return mid === 'spinjs/jquery.spin';
            }
        }
    }, {
        name: 'moment',
        main: 'moment',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|txt|src|min|templates|dist)/]
        ],
        resourceTags: {
            amd: function (filename) {
                return /\.js$/.test(filename);
            },
            test: function (filename, mid) {
                return /\/tests/.test(mid);
            },
            miniExclude: function (filename, mid) {
                return /\/src/.test(mid) || /\/templates/.test(mid);
            }
        }
    }],
    staticHasFeatures: {
        'dojo-trace-api': 0,
        'dojo-log-api': 0,
        'dojo-publish-privates': 0,
        'dojo-sync-loader': 0,
        'dojo-xhr-factory': 0,
        'dojo-test-sniff': 0
    },
    userConfig: {
        packages: ['app', 'dijit', 'dojox', 'agrc', 'esri', 'toaster', 'layer-selector', 'sherlock']
    }
};
