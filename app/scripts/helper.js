'use strict';

// The "Price" object
class Price {
  constructor(type, rate, currency, fullPage = false) {
    if (fullPage === false) {
      this.priceClass = $(type).first();

    } else {
      this.priceClass = $(type);
    }
    const price = this.priceClass.contents().filter(function () { return this.nodeType == 3; }).text().trim();
    // Remove separator and JPY
    const trimPrice = function (string) {
      return string.replace(/,/g, '').slice(0, -4);
    }
    const convertToLocalPrice = function (rate) {
      return (trimPrice(price) * rate).toFixed(2);
    }
    this.localPrice = convertToLocalPrice(rate);
  }
  convert(currency) {
    const lp = this.localPrice;
    this.priceClass.fadeOut(200, function () {
      console.log(currency);
      $(this).text(lp + '\u00A0' + currency).fadeIn(200);
    });
  }
}


function currencyConvert(currency) {
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
    });
  });
}