define([
    'app/config',

    'agrc/modules/Domains',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'dojo/_base/declare',
    'dojo/debounce',
    'dojo/dom-class',
    'dojo/on',
    'dojo/text!app/filters/templates/SpeciesLengthForm.html'
], function (
    config,

    domains,

    _WidgetBase,
    _TemplatedMixin,

    declare,
    debounce,
    domClass,
    on,
    template
) {
    const RADIX = 10;

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: 'species-length-form',


        // passed in via the constructor
        // onChange: function
        //      Function to call when a value changes
        onChange: null,

        postCreate() {
            console.log('app/filters/SpeciesLengthForm:postCreate', arguments);

            domains.populateSelectWithDomainValues(
                this.species,
                `${config.urls.mapService}/${config.layerIndexes.fish}`,
                config.fieldNames.SPECIES_CODE
            ).then(() => {
                const firstOption = this.species.childNodes[0];
                firstOption.innerHTML = '(none)';
                firstOption.value = '';
            });

            this.own(
                on(this.min, 'keyup', event => {
                    this.validateNumericInput(event.currentTarget.value);
                }),
                on(this.max, 'keyup', event => {
                    this.validateNumericInput(event.currentTarget.value);
                }),
                on(this.species, 'change', this.onChange.bind(this))
            );
        },
        validateNumericInput: debounce(function (value) {
            console.log('app/filters/SpeciesLengthForm:validateNumericInput', arguments);

            // reset error messages
            domClass.add(this.invalidMessage, 'hidden');
            domClass.add(this.minMaxMessage, 'hidden');

            if (!this.isPositiveWholeNumber(value)) {
                domClass.remove(this.invalidMessage, 'hidden');

                return;
            }

            if (this.min.value.length && this.max.value.length &&
                !(parseInt(this.min.value, RADIX) < parseInt(this.max.value, RADIX))) {
                domClass.remove(this.minMaxMessage, 'hidden');

                return;
            }

            this.onChange();
        }, config.validateDelay),
        isPositiveWholeNumber(value) {
            const parsedValue = parseFloat(value, RADIX);

            return value.length === 0 || (!isNaN(value) && Number.isInteger(parsedValue) && parsedValue >= 0);
        },
        isValid() {
            console.log('app/filters/SpeciesLengthForm:isValid', arguments);

            if (this.min.value.length || this.max.value.length) {
                return this.isPositiveWholeNumber(this.min.value) && this.isPositiveWholeNumber(this.max.value);
            }

            return true;
        },
        isPopulated() {
            // summary:
            //      returns true if at least one input has a value
            console.log('app/filters/SpeciesLengthForm:isPopulated', arguments);

            return this.species.value.length || this.min.value.length || this.max.value.length;
        },
        getQuery() {
            console.log('app/filters/SpeciesLengthForm:getQuery', arguments);

            const queryInfos = [
                [this.species, '=', config.fieldNames.SPECIES_CODE, '\''],
                [this.min, '>=', config.fieldNames.LENGTH, ''],
                [this.max, '<=', config.fieldNames.LENGTH, '']
            ];

            const parts = queryInfos
                .filter(([node]) => node.value.length > 0)
                .map(([node, comparison, fieldName, quote]) => {
                    return `${fieldName} ${comparison} ${quote}${node.value}${quote}`;
                });

            return (parts.length) ? parts.join(' AND ') : null;
        },
        clear() {
            console.log('app/filters/SpeciesLengthForm:clear', arguments);

            this.species.value = '';
            this.min.value = '';
            this.max.value = '';
        }
    });
});
