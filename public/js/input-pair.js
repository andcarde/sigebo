
// input-pair.js
'use strict';

function makeBuilders(section) {
    const buildName = function(object) {
        return `${section}-${object}`;
    };
    function toId(name) {
        return '#' + name;
    }
    const buildId = (object) => {
        return toId(buildName(object));
    };
    function toClass(name) {
        return '.' + name;
    }
    const buildClass = (object) => {
        return toClass(buildName(object));
    };

    return {buildName, buildId, buildClass};
}

class PairContainer {
    constructor(section, $container, keys, validate) {
        const {buildName, buildClass} = makeBuilders(section);
        // keys : array<string>
        this.keys = keys;
        // Previous value on focus
        this.previousKey = '';
        // selectedKeys : Set<string>
        this.selectedKeys = new Set();
        this.validate = validate;
        // $container : jQuery
        this.$container = $container;
        // pairClassName : string
        this.pairClassName = buildName('pair');
        // $pairClass : function
        this.$pairClass = () => $(buildClass('pair'));
        // keyClassName : string
        this.keyClassName = buildName('key');
        // keyClass : string
        this.keyClass = buildClass('key');
        // quantityClassName : string
        this.quantityClassName = buildName('quantity');
        // quantityClass : string
        this.quantityClass = buildClass('quantity');
        // It is necessary to bind the function to the object
        this.tryAddPair = this.tryAddPair.bind(this);
        // Initialize the pair container
        this.init();
    }
    setPreviousKeyRecorder() {
        const pairContainer = this;
        $(document).on('focus', this.keyClass, function() {
            // Store the current value when receiving focus
            pairContainer.previousKey = $(this).val();
        });
    }
    setQuantityFields() {
        $(document).on('input change', this.quantityClass, function () {
            // Get the current value and remove non-numeric characters
            let quantity = $(this).val().replace(/[^0-9]/g, '');
            // Convert the value to a number
            quantity = parseInt(quantity, 10);

            if (isNaN(quantity) || quantity <= 0)
                $(this).val('');
            else
                $(this).val(quantity);
        });
    }
    init() {
        this.setPreviousKeyRecorder();
        this.setQuantityFields();
        // Event of adding a new pair (option, quantity)
        const pairContainer = this;
        $(document).on('input change', this.quantityClass, pairContainer.tryAddPair);
        this.setKeySelector();
        this.$container.empty();
        this.addPair();
    }
    setKeySelector() {
        const pairContainer = this;
        $(document).on('change', this.keyClass, function() {
            const previousKey = pairContainer.previousKey;
            const selectedKeys = pairContainer.selectedKeys;
            const keyClass = pairContainer.keyClass;
            const currentKey = $(this).val();
            if (currentKey === previousKey)
                return;

            const changedSelector = $(this);
            if (currentKey !== '') {
                selectedKeys.add(currentKey);
                $(keyClass).each(function() {
                    const selector = $(this);
                    if (!selector.is(changedSelector))
                        selector.find(`option[value="${currentKey}"]`).remove();
                });
                pairContainer.tryAddPair();
            }
            if (previousKey !== '') {
                selectedKeys.delete(previousKey);
                $(keyClass).each(function() {
                    const selector = $(this);
                    if (!selector.is(changedSelector))
                        selector.append(`<option value="${previousKey}">${previousKey}</option>`);
                });
            }
        });
    }
    addPair() {
        const keyOptions = this.keys.filter(key => !this.selectedKeys.has(key))
                .map(key => `<option value="${key}">${key}</option>`).join('');
        const newRow = $(`
            <div class="row mb-3 ${this.pairClassName}">
                <div class="col-6 mx-auto">
                    <input type="number" class="form-control text-center ${this.quantityClassName}" placeholder="Cantidad">
                </div>
                <div class="col-6 mx-auto">
                    <select class="form-select ${this.keyClassName}">
                        <option value="">Vacío</option>
                        ${keyOptions}
                    </select>
                </div>
            </div>
        `);
        this.$container.append(newRow);
        
        const pairContainer = this;
        const sendValidation = () => {
            const isValid = pairContainer.verifyFields();
            pairContainer.validate(isValid);
        }
        newRow.find(this.quantityClass).on('input', sendValidation);
        newRow.find(this.keyClass).on('change', sendValidation);
    }
    tryAddPair() {
        if (this.keys.length > this.selectedKeys.size) {
            const pairContainer = this;
            // fullPairs : boolean
            const fullPairs = this.$pairClass().toArray().every(pair => {
                // mount : string
                const quantity = $(pair).find(pairContainer.quantityClass).val();
                // option : string
                const option = $(pair).find(pairContainer.keyClass).val();
                return quantity && option;
            });
            if (fullPairs)
                this.addPair();
        }
    }
    // Verify if the fields are valid
    verifyFields() {
        const pairContainer = this;
        const validPairs = this.$pairClass().toArray().some(pair => {
            const quantity = $(pair).find(pairContainer.quantityClass).val();
            const key = $(pair).find(pairContainer.keyClass).val();
            return quantity && key;
        });
        
        const incompletePairs = this.$pairClass().toArray().some(pair => {
            const quantity = $(pair).find(pairContainer.quantityClass).val();
            const key = $(pair).find(pairContainer.keyClass).val();
            return (!quantity && key) || (!key && quantity);
        });

        return validPairs && !incompletePairs;
    }
    // Get the options from the container
    getOptions() {
        // options : map<string, int>
        let options = new Map();
        const pairContainer = this;
        this.$pairClass().toArray().forEach(pair => {
            // quantity : int
            const quantity = parseInt($(pair).find(pairContainer.quantityClass).val(), 10);
            // key : string
            const key = $(pair).find(pairContainer.keyClass).val();
            if (!isNaN(quantity) && key)
                options.set(key, quantity);
        });
        // options : array<array<string, int>>
        options = Array.from(options);
        return options;
    }
}