/* eslint-disable no-implicit-globals, no-undef */
profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: 'uglify',
    layerOptimize: 'uglify',
    stripConsole: 'all',
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'dojo/i18n',
                'dojo/domReady',
                'app/packages',
                'app/run',
                'app/App',
                'dojox/gfx/path',
                'dojox/gfx/svg',
                'dojox/gfx/shape'
            ],
            includeLocales: ['en-us'],
            customBase: true,
            boot: true
        }
    },
    packages: [{
        name: 'bootstrap-css-only',
        location: './bootstrap-css-only'
    }, {
        name: 'spin',
        resourceTags: {
            copyOnly: function (filename, mid) {
                return mid === 'spin/jquery.spin';
            }
        }
    }, {
        name: 'moment',
        main: 'moment',
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
        packages: ['app', 'dijit', 'dojox', 'agrc', 'esri', 'toaster']
    }
};
