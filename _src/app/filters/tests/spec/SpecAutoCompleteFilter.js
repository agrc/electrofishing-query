require([
    'app/filters/AutoCompleteFilter'
], function (
    AutoCompleteFilter
) {
    describe('app/filters/SpecAutoCompleteFilter', () => {
        let widget;
        beforeEach(() => {
            widget = new AutoCompleteFilter({});
            widget.startup();
        });

        describe('getQuery', () => {
            it('returns the appropriate query string', () => {
                widget.afterSelect({
                    attributes: {
                        WaterName: 'ABES CR',
                        COUNTY: 'SEVIER'
                    }
                });
                widget.afterSelect({
                    attributes: {
                        WaterName: 'BAR A CR',
                        COUNTY: 'GRAND'
                    }
                });

                // eslint-disable-next-line max-len
                const expected = "WATER_ID IN (SELECT Permanent_Identifier FROM Electrofishing.WILDADMIN.UDWRStreams WHERE (WaterName = 'ABES CR' AND COUNTY = 'SEVIER') OR (WaterName = 'BAR A CR' AND COUNTY = 'GRAND')) OR WATER_ID IN (SELECT Permanent_Identifier FROM Electrofishing.WILDADMIN.UDWRLakes WHERE (WaterName = 'ABES CR' AND COUNTY = 'SEVIER') OR (WaterName = 'BAR A CR' AND COUNTY = 'GRAND'))";

                expect(widget.getQuery().where).toEqual(expected);
            });
        });
    });
});
