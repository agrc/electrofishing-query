require([
    'agrc-jasmine-matchers/topics',

    'app/config',
    'app/FilterContainer',
    'app/mapController',

    'dojo/dom-class',
    'dojo/_base/array'
], function (
    topics,

    config,
    FilterContainer,
    mapController,

    domClass,
    array
) {
    describe('app/FilterContainer', function () {
        var testWidget;
        beforeEach(function () {
            mapController.filterFeatures = function () {};
            topics.listen(config.topics.filterFeatures);
            testWidget = new FilterContainer();
        });
        afterEach(function () {
            if (testWidget) {
                if (testWidget.destroy) {
                    testWidget.destroy();
                }

                testWidget = null;
            }
        });
        it('sanity', function () {
            expect(testWidget).toEqual(jasmine.any(FilterContainer));
        });
        describe('postCreate', function () {
            it('creates the filters', function () {
                expect(testWidget.filters.length > 0).toBe(true);
            });
        });
        describe('addFilter', function () {
            it('adds the filter to the container', function () {
                testWidget.select.value = testWidget.filters[0].id;
                testWidget.addFilter();

                expect(testWidget.container.children[0]).toBe(testWidget.filters[0].domNode);
            });
            it('shouldn\'t do anything if none is selected', function () {
                spyOn(testWidget, 'getFilter');
                testWidget.select.value = 'none';
                testWidget.addFilter();

                expect(testWidget.getFilter).not.toHaveBeenCalled();
            });
            it('removes the filter from the select', function () {
                testWidget.select.value = testWidget.filters[0].id;
                testWidget.addFilter();

                expect(array.every(testWidget.select.children, function (option) {
                    if (option.value === testWidget.filters[0].id) {
                        return domClass.contains(option, 'hidden');
                    }

                    return true;
                })).toBe(true);
            });
        });
        describe('onFilterChange', function () {
            beforeEach(function () {
                testWidget.filters = [{
                    getQuery: function () {
                        return {
                            table: 'blah',
                            where: 'one'
                        };
                    }
                }, {
                    getQuery: function () {
                        return {
                            table: 'blah',
                            where: 'two'
                        };
                    }
                }];
            });
            it('adds the geometry', function () {
                var geo = {};
                testWidget.filters.push({
                    getQuery: function () {
                        return geo;
                    }
                });

                testWidget.onFilterChange();

                expect(testWidget.geo).toBe(geo);
                expect(testWidget.wheres.length).toBe(2);
            });
            it('can show only geometry', function () {
                var geo = {};
                testWidget.filters = [{
                    getQuery: function () {
                        return geo;
                    }
                }];

                testWidget.onFilterChange();

                expect(testWidget.geo).toBe(geo);
            });
            it('doesn\'t overwrite geometry', function () {
                var geo = {};
                testWidget.filters = [{
                    getQuery: function () {
                        return geo;
                    }
                }, {
                    getQuery: function () {}
                }];

                testWidget.onFilterChange();

                expect(testWidget.geo).toBe(geo);
            });
        });
    });
});
