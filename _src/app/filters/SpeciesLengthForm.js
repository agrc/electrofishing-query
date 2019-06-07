define([
    'app/config',

    'agrc/modules/Domains',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/on',
    'dojo/text!app/filters/templates/SpeciesLengthForm.html',

    'lodash'
], function (
    config,

    domains,

    _WidgetBase,
    _TemplatedMixin,

    declare,
    domClass,
    on,
    template,

    _
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

            const minDebouncedValidation = _.debounce(this.validateNumericInput.bind(this), config.validateDelay);
            const maxDebouncedValidation = _.debounce(this.validateNumericInput.bind(this), config.validateDelay);
            this.own(
                on(this.min, 'keyup', event => minDebouncedValidation(event.currentTarget)),
                on(this.max, 'keyup', event => maxDebouncedValidation(event.currentTarget)),
                on(this.min, 'focus', event => {
                    this.validateNumericInput(event.currentTarget);
                }),
                on(this.max, 'focus', event => {
                    this.validateNumericInput(event.currentTarget);
                }),
                on(this.species, 'change', this.onChange.bind(this))
            );
        },
        validateNumericInput(currentTarget) {
            console.log('app/filters/SpeciesLengthForm:validateNumericInput', arguments);

            this.hideErrorMessages(currentTarget);

            const makeInvalid = () => {
                domClass.add(currentTarget.parentElement, 'has-error');
            };

            if (!this.isPositiveWholeNumber(currentTarget.value)) {
                domClass.remove(this.invalidMessage, 'hidden');
                makeInvalid();

                return;
            }

            if (this.min.value.length && this.max.value.length &&
                !(parseInt(this.min.value, RADIX) < parseInt(this.max.value, RADIX))) {
                domClass.remove(this.minMaxMessage, 'hidden');
                makeInvalid();

                return;
            }

            this.onChange();
        },
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

            this.hideErrorMessages(this.min);
            this.hideErrorMessages(this.max);
        },
        hideErrorMessages(currentTarget) {
            domClass.add(this.invalidMessage, 'hidden');
            domClass.add(this.minMaxMessage, 'hidden');
            domClass.remove(currentTarget.parentElement, 'has-error');
        }
    });
});
