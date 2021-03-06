/* global JasmineFaviconReporter, jasmineRequire */
/* eslint-disable no-unused-vars */
var dojoConfig = {
    // isDebug: false,
    isJasmineTestRunner: true,
    packages: [{
        name: 'agrc-jasmine-matchers',
        location: 'agrc-jasmine-matchers/src'
    }, {
        name: 'stubmodule',
        location: 'stubmodule/src',
        main: 'stub-module'
    }],
    has: {
        'dojo-undef-api': true
    }
};

// for jasmine-favicon-reporter
jasmine.getEnv().addReporter(new JasmineFaviconReporter());
jasmine.getEnv().addReporter(new jasmineRequire.JSReporter2());
