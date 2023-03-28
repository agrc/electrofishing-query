define([
    'app/config',
    'app/FilterContainer',
    'app/Grid',
    'app/mapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-construct',
    'dojo/has',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',

    'esri/request',

    'sherlock/Sherlock',
    'sherlock/providers/MapService',

    'toaster/dist/Toaster',

    'dijit/layout/BorderContainer'
], function (
    config,
    FilterContainer,
    Grid,
    mapController,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domConstruct,
    has,
    template,
    declare,

    esriRequest,

    Sherlock,
    MapService,

    Toaster
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        constructor: function () {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            AGRC.app = this;
        },
        postCreate: function () {
            this.dataEntryAppLink.href = config.dataEntryApp;

            this.auth = window.firebase.getAuth();

            if (!has('agrc-build')) {
                // comment out this and the auth config in firebase.json to hit utahid directly
                window.firebase.connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
            }

            this.auth.onAuthStateChanged((user) => {
                if (user) {
                    this.initializeUser(user);
                }
            });

            this.initServiceWorker();
        },
        initServiceWorker: function () {
            if ('serviceWorker' in navigator === false) {
                // eslint-disable-next-line no-alert
                window.alert('This browser does not support service workers. Please use a more modern browser.');

                return;
            }

            try {
                navigator.serviceWorker.register('ServiceWorker.js');
            } catch (error) {
                console.error('Service worker registration failed', error);
            }
        },
        login: function () {
            const provider = new window.firebase.OAuthProvider('oidc.utahid');
            provider.addScope('app:DWRElectroFishing');

            window.firebase.signInWithPopup(this.auth, provider);
        },
        initializeUser: function (user) {
            console.log('initializeUser', user);
            user.getIdTokenResult().then((response) => {
                if (this.checkClaims(response.claims)) {
                    this.user = user;
                    this.loginButton.style.display = 'none';
                    this.logoutButton.style.display = 'block';
                    this.userSpan.innerHTML = user.email;

                    this.initApp();
                } else {
                    // eslint-disable-next-line no-alert
                    window.alert(`${user.email} is not authorized to use this app.`);
                }
            });
        },
        checkClaims: function (claims) {
            if (!has('agrc-build')) {
                return true;
            }

            const utahIDEnvironments = {
                prod: 'Prod',
                stage: 'AT',
                development: 'Dev',
                test: 'Test'
            };

            return (
                claims.firebase?.sign_in_attributes?.['DWRElectroFishing:AccessGranted'] &&
                claims.firebase.sign_in_attributes['DWRElectroFishing:AccessGranted'].includes(
                    utahIDEnvironments[has('agrc-build') || 'development']
                )
            );
        },
        logout: function () {
            window.firebase.signOut(this.auth);
            this.loginButton.style.display = 'block';
            this.logoutButton.style.display = 'none';
            this.userSpan.innerHTML = '';

            window.location.reload();
        },
        initApp: function () {
            // summary:
            //      Fires when
            console.log('app.App::initApp', arguments);

            mapController.initMap(this.mapDiv);

            this.grid = new Grid(null, this.gridDiv);
            this.filterContainer = new FilterContainer(null, this.filterDiv);
            const streamsProvider = new MapService(
                `${config.urls.referenceService}/${config.layerIndexes.streams}`,
                config.fieldNames.WaterName,
                { wkid: config.wkids.webMercator }
            );
            this.streamsSherlock = new Sherlock({
                placeHolder: 'stream name',
                provider: streamsProvider,
                map: mapController.map,
                preserveGraphics: true
            }, this.streamsSherlockDiv);
            const lakesProvider = new MapService(
                `${config.urls.referenceService}/${config.layerIndexes.lakes}`,
                config.fieldNames.WaterName,
                { wkid: config.wkids.webMercator }
            );
            this.lakesSherlock = new Sherlock({
                placeHolder: 'lake name',
                provider: lakesProvider,
                map: mapController.map,
                baseClass: 'sherlock sherlock-2'
            }, this.lakesSherlockDiv);
            this.children = [
                this.filterContainer,
                this.grid,
                this.streamsSherlock,
                this.lakesSherlock,
                // eslint-disable-next-line new-cap
                new Toaster.default({
                    topic: config.topics.toast
                }, domConstruct.create('div', {}, document.body))
            ];

            this.children.forEach(function (child) {
                child.startup();
            });

            // set version number
            this.version.innerHTML = AGRC.version;
        }
    });
});
