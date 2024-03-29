(function () {
    // the baseUrl is relevant in source version and while running unit tests.
    // the`typeof` is for when this file is passed as a require argument to the build system
    // since it runs on node, it doesn't have a window object. The basePath for the build system
    // is defined in build.profile.js
    var config = {
        baseUrl:
      typeof window !== 'undefined' && window.dojoConfig?.isJasmineTestRunner ?
          '/src' :
          './'
    };
    require(config, [
        'dojo/parser',
        'jquery',
        'dojo/domReady!'
    ], function (parser) {
        if (!window.dojoConfig?.isJasmineTestRunner) {
            window.firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
            console.log('firebase app initialized');
        }

        parser.parse();
    });
}());
