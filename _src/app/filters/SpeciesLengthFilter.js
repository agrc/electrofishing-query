define([
    'app/config',
    'app/filters/_Filter',
    'app/filters/SpeciesLengthForm',

    'dojo/text!app/filters/templates/SpeciesLengthFilter.html',
    'dojo/dom-construct',
    'dojo/_base/declare',

    'bootstrap'
], function (
    config,
    _Filter,
    SpeciesLengthForm,

    template,
    domConstruct,
    declare
) {
    return declare([_Filter], {
        templateString: template,
        baseClass: 'species-length-filter',

        forms: null,

        postCreate() {
            console.log('app/filters/SpeciesLengthFilter:postCreate', arguments);

            const numForms = 4;
            this.forms = [];

            for (let i = 0; i < numForms; i++) {
                const form = new SpeciesLengthForm({
                    onChange: this.onChange.bind(this)
                }, domConstruct.create('div', null, this.container));
                form.startup();

                this.forms.push(form);
            }

            this.inherited(arguments);
        },
        clear() {
            console.log('app/filter/SpeciesLengthFilter:clear', arguments);

            this.forms.forEach(form => form.clear());

            this.emit('changed');
        },
        onChange() {
            console.log('app/filter/SpeciesLengthFilter:onChange', arguments);

            this.emit('changed');
        },
        isValid() {
            console.log('app/filter/SpeciesLengthFilter:isValid', arguments);

            return this.forms.every(form => form.isValid()) &&
                this.forms.some(form => form.isPopulated());
        },
        getQuery() {
            console.log('app/filter/SpeciesLengthFilter:getQuery', arguments);

            if (this.isValid()) {
                return {
                    table: config.tableNames.fish,
                    where: this.forms
                        .filter(form => form.getQuery())
                        .map(form => form.getQuery())
                        .join(' OR ')
                };
            }

            return undefined;
        }
    });
});
