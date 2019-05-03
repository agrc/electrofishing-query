/* eslint-disable max-len */
require([
    'app/Grid',

    'dojo/dom-class',
    'dojo/dom-construct'
], function (
    WidgetUnderTest,

    domClass,
    domConstruct
) {
    describe('app/Grid', function () {
        var widget;
        var destroy = function (destroyWidget) {
            destroyWidget.destroyRecursive();
            destroyWidget = null;
        };

        beforeEach(function () {
            widget = new WidgetUnderTest(null, domConstruct.create('div', null, document.body));
            widget.startup();
        });

        afterEach(function () {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function () {
            it('should create a Grid', function () {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('populateGrid', function () {
            it('init\'s grids if they are not existing', function () {
                widget.grid = null;
                spyOn(widget, 'initGrid').and.callThrough();

                widget.populateGrid('blah');
                widget.populateGrid('blah');

                expect(widget.initGrid.calls.count()).toBe(1);
            });
            it('doesn\'t create a new store if the def query hasn\'t changed', function () {
                widget.initGrid();
                spyOn(widget.grid, 'set').and.callThrough();

                widget.populateGrid('blah');
                widget.populateGrid('blah');

                expect(widget.grid.set.calls.count()).toBe(1);
            });
        });
    });
});
