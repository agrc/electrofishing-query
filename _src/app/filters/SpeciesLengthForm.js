define([
    'app/config',

    'agrc/modules/Domains',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/on',
    'dojo/text!app/filters/templates/SpeciesLengthForm.html'
], function (
    config,

    domains,

    _WidgetBase,
    _TemplatedMixin,

    declare,
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
            );

            this.own(
                on(this.min, 'keyup', this.validateNumericInput.bind(this)),
                on(this.max, 'keyup', this.validateNumericInput.bind(this)),
                on(this.species, 'change', this.onChange.bind(this))
            );
        },
        validateNumericInput(event) {
            console.log('app/filters/SpeciesLengthForm:validateNumericInput', arguments);

            // reset error messages
            domClass.add(this.invalidMessage, 'hidden');
            domClass.add(this.minMaxMessage, 'hidden');

            const value = event.currentTarget.value;
            if (!this.isWholeNumber(value)) {
                domClass.remove(this.invalidMessage, 'hidden');

                return;
            }

            if (this.min.value.length && this.max.value.length &&
                !(parseInt(this.min.value, RADIX) < parseInt(this.max.value, RADIX))) {
                domClass.remove(this.minMaxMessage, 'hidden');

                return;
            }

            this.onChange();
        },
        isWholeNumber(value) {
            return value.length === 0 || (!isNaN(value) && Number.isInteger(parseFloat(value, RADIX)));
        },
        isValid() {
            console.log('app/filters/SpeciesLengthForm:isValid', arguments);

            if (this.min.value.length || this.max.value.length) {
                return this.isWholeNumber(this.min.value) && this.isWholeNumber(this.max.value);
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
