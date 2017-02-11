'use strict';

// https://developer.chrome.com/extensions/optionsV2
// Saves options to chrome.storage.sync.
function save_options() {
    const currency = $("#countryName").val();
    chrome.storage.sync.set({
        currency: currency
    }, function () {
        // Update status to let user know options were saved.
        const status = $("#status");
        status.text('Options saved.');
        setTimeout(function () {
            status.text('');
            window.close();
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        currency: 'USD'
    }, function (items) {
        const aUrl = 'https://www.currency-iso.org/dam/downloads/lists/list_one.xml';
        $.get(aUrl, function (data) {
            const $xml = $(data);
            $xml.find('CcyNtry').each(function () {
                const countryName = $(this).find('CtryNm').text();
                const currency = $(this).find('Ccy').text();
                $("#countryName").append('<option value=' + currency + '>' + countryName + '</option>');
            })
            $("#countryName").val(items.currency).change();
        }, 'xml');

    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);