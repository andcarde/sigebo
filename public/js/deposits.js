
// deposits.js
'use strict';

// import create$$ function from './section-utils.js'
// import log, logError functions from './log-utils.js'
// import chargeContainers function from './inventario.js'

$(document).ready(function() {
    const section = 'createDeposit';
    const $$ = create$$(section);
    const everMandatoryFields = ['capacity'];
    const singleMandatoryFields = ['name'];
    const multipleMandatoryFields = ['quantity', 'serie', 'firstIdNumber'];
    const allMandatoryFields = everMandatoryFields.concat(singleMandatoryFields).concat(multipleMandatoryFields);
    const optionalFields = ['baseDiameter', 'purchaseDate', 'vendor', 'manufacturer', 'manufacturerDate'];
    const allFields = allMandatoryFields.concat(optionalFields);
    const $multipleCheck = $$('multiple');
    const $singleBox = $$('singleField');
    const $multipleBox = $$('multipleFields');
    const $cancelButtons = $$('close');
    const $petitionButton = $$('petition');
    const $modal = $$('modal');

    setMultipleCheck();
    setCancelButtons();
    setPetitionButton();

    function setMultipleCheck() {
        // Default: Hide multiple add fields
        $multipleBox.hide();

        $multipleCheck.on('change', function() {
            if (this.checked) {
                $singleBox.hide();
                singleMandatoryFields.forEach(field => $$(field).val(''));
                $multipleBox.show();
            } else {
                $multipleBox.hide();
                multipleMandatoryFields.forEach(field => $$(field).val(''));
                $singleBox.show();
            }
        });
    }

    function setCancelButtons() {        
        $cancelButtons.each(function() {
            $(this).on('click', emptyModal);
        });
    }
    
    function emptyModal() {
        allFields.forEach(field => $$(field).val(''));
        $petitionButton.prop('disabled', true);
    }

    function setPetitionButton() {
        // Default: Disable petition button
        $petitionButton.prop('disabled', true);

        const events = ['input', 'change'];
        allMandatoryFields.forEach(field => {
            const input = $$(field);
            events.forEach(event => input.on(event, updatePetitionButton));
        });

        $petitionButton.on('click', function() {
            const depositsData = buildDepositsData();
            makePetition(depositsData, $modal);
        });
    }

    function updatePetitionButton() {
        const mandatoryFields = getMandatoryFields();
        mandatoryFields.forEach(field => {
            const input = $$(field);
            if (input.val().trim() === '') {
                $petitionButton.prop('disabled', true);
                return;
            }
        });

        $petitionButton.prop('disabled', false);
    }

    function buildDepositsData() {
        let depositsData = {
            type: 'deposito'
        };

        const fields = optionalFields.concat(getMandatoryFields());
        fields.forEach(field => {
            const value = $$(field).val().trim();
            if (value !== '')
                depositsData[field] = value;
        });

        // <DEBUG>
        log(depositsData, 'depositsData');
        // </DEBUG>
        return depositsData;
    }

    function getMandatoryFields() {
        const sometimesMandatoryFields = $multipleCheck.is(':checked') ?
            multipleMandatoryFields : singleMandatoryFields;
        const mandatoryFields = everMandatoryFields.concat(sometimesMandatoryFields);
        // <DEBUG>
        log(mandatoryFields, 'mandatoryFields');
        // </DEBUG>
        return mandatoryFields;
    }
});

function makePetition(containersData, $modal) {
    // <DEBUG>
    console.log('> Creating Deposit Petition');
    // </DEBUG>
    const url = '/create-containers';
    // AYAX request to create deposits
    $.ajax({
        method: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(containersData),
        success: function() {
            $modal.modal('hide');
            chargeContainers();
        },
        error: function(xhr) {
            $modal.modal('hide');

            const info = 'Failed to add new containers';
            logError(info, url, xhr)
        }
    });
}