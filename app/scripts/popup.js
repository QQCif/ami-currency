'use strict';

// https://developer.chrome.com/extensions/optionsV2
// Saves options to chrome.storage.local.
function save_options() {
  const currency = $("#countryName").val();
  chrome.storage.local.set({
    currency: currency
  }, function () {
    console.log('Currency is ' + currency);

    const currency_input = 1;
    const currency_from = 'JPY'; // currency codes : http://en.wikipedia.org/wiki/ISO_4217
    const currency_to = currency;
    // http://stackoverflow.com/questions/3139879/how-do-i-get-currency-exchange-rates-via-an-api-such-as-google-finance/16408368#16408368
    const yql_base_url = 'https://query.yahooapis.com/v1/public/yql';
    const yql_query = 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20("' + currency_from + currency_to + '")';
    const yql_query_url = yql_base_url + '?q=' + yql_query + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

    // Fire Ajax using GET method
    $.get(yql_query_url, function (data) {
      const aRate = data.query.results.rate.Rate;
      console.log('Exchange rate is ' + aRate);

      chrome.storage.local.set({
        rate: aRate
      }, function () {
        console.log('Rate saved.');
        window.close();
        chrome.tabs.reload();
      });
    });
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
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