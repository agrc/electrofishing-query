/* eslint-disable no-magic-numbers, max-len */
require([
    'app/config',
    'app/filters/SpeciesLengthForm',

    'dojo/dom-construct'
], function (
    config,
    SpeciesLengthForm,

    domConstruct
) {
    describe('app/filters/SpeciesLengthForm', () => {
        let widget;
        const speciesTestValue = 'BLAH';
        beforeEach(() => {
            widget = new SpeciesLengthForm({
                onChange: () => {}
            });
            widget.startup();

            domConstruct.create('option', {
                value: ''
            }, widget.species);

            domConstruct.create('option', {
                value: speciesTestValue
            }, widget.species);
        });

        afterEach(() => {
            widget.destroy();
        });

        describe('isPositiveWholeNumber', () => {
            it('handles strings, negative numbers and decimals', () => {
                expect(widget.isPositiveWholeNumber('1')).toBe(true);
                expect(widget.isPositiveWholeNumber('1234')).toBe(true);
                expect(widget.isPositiveWholeNumber(1234)).toBe(true);
                expect(widget.isPositiveWholeNumber('12.3')).toBe(false);
                expect(widget.isPositiveWholeNumber('12a')).toBe(false);
                expect(widget.isPositiveWholeNumber('a')).toBe(false);
                expect(widget.isPositiveWholeNumber('-1')).toBe(false);
            });
        });
        describe('getQuery', () => {
            it('returns null if there are no values selected', () => {
                expect(widget.getQuery()).toBeNull();
            });
            it('species and no min or max', () => {
                widget.species.value = speciesTestValue;

                expect(widget.getQuery()).toBe(
                    `${config.fieldNames.SPECIES_CODE} = '${speciesTestValue}'`
                );
            });
            it('species and min and no max', () => {
                widget.species.value = speciesTestValue;
                widget.min.value = '1';

                expect(widget.getQuery()).toBe(
                    `${config.fieldNames.SPECIES_CODE} = '${speciesTestValue}' AND ${config.fieldNames.LENGTH} >= 1`
                );
            });
            it('species, min and max', () => {
                widget.species.value = speciesTestValue;
                widget.min.value = '1';
                widget.max.value = '2';

                expect(widget.getQuery()).toBe(
                    `${config.fieldNames.SPECIES_CODE} = '${speciesTestValue}' AND ${config.fieldNames.LENGTH} >= 1 AND ${config.fieldNames.LENGTH} <= 2`
                );
            });
            it('no species and min and no max', () => {
                widget.min.value = '1';

                expect(widget.getQuery()).toBe(
                    `${config.fieldNames.LENGTH} >= 1`
                );
            });
            it('no species and min and max', () => {
                widget.min.value = '1';
                widget.max.value = '2';

                expect(widget.getQuery()).toBe(
                    `${config.fieldNames.LENGTH} >= 1 AND ${config.fieldNames.LENGTH} <= 2`
                );
            });
        });
    });
});
