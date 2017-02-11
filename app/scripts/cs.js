'use strict';

// Hardcoded locale for testing
let localCurrencyCode = '';

chrome.storage.sync.get({
  currency: 'USD'
}, function (items) {
  localCurrencyCode = items.currency;
  currencyConvert(localCurrencyCode);
});

// The "Price" object
class Price {
  constructor(type, rate) {
    this.priceClass = $(type).first();
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
  convert() {
    const lp = this.localPrice;
    this.priceClass.fadeOut(200, function () {
      $(this).text(lp + '\u00A0' + localCurrencyCode).fadeIn(200);
    });
  }
}

function currencyConvert(locale) {
  console.log('Currency is ' + locale);

  const currency_input = 1;
  const currency_from = 'JPY'; // currency codes : http://en.wikipedia.org/wiki/ISO_4217
  const currency_to = locale;
  // http://stackoverflow.com/questions/3139879/how-do-i-get-currency-exchange-rates-via-an-api-such-as-google-finance/16408368#16408368
  const yql_base_url = 'https://query.yahooapis.com/v1/public/yql';
  const yql_query = 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20("' + currency_from + currency_to + '")';
  const yql_query_url = yql_base_url + '?q=' + yql_query + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  let rate = 0;

  // Fire Ajax using GET method
  $.get(yql_query_url, function (data) {
    rate = data.query.results.rate.Rate;
    console.log('Exchange rate is ' + rate)

    // Make a "Price" object
    const price = new Price('.price', rate);
    price.convert();

    const sellingPrice = new Price('.selling_price', rate);
    sellingPrice.convert();
  });
}
