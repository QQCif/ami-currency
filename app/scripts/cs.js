// Hardcoded locale for testing
var localCurrencyCode = "CNY";

// The "Price" object
function Price(type, rate) {
  this.price = $(type).contents().filter(function () { return this.nodeType == 3; }).text();
  // Remove separator and JPY
  this.trimPrice = function (string) {
    return string.replace(/,/g, "").slice(0, -4);
  }
  this.convertToLocalPrice = function (rate) {
    return Math.trunc(this.trimPrice(this.price) * rate);
  }
  var localPrice = this.convertToLocalPrice(rate);
  this.convert = function () {
    $(type).fadeOut(200, function () {
      $(this).text(localPrice + "\u00A0CNY").fadeIn(200);
    });
  }
}

currencyConvert(localCurrencyCode);

function currencyConvert(locale) {
  var currency_input = 1;
  var currency_from = "JPY"; // currency codes : http://en.wikipedia.org/wiki/ISO_4217
  var currency_to = locale;
  // http://stackoverflow.com/questions/3139879/how-do-i-get-currency-exchange-rates-via-an-api-such-as-google-finance/16408368#16408368
  var yql_base_url = "https://query.yahooapis.com/v1/public/yql";
  var yql_query = 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20("' + currency_from + currency_to + '")';
  var yql_query_url = yql_base_url + "?q=" + yql_query + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

  var rate = 0;

  // Fire Ajax using GET method
  $.get(yql_query_url, function (data) {
    rate = data.query.results.rate.Rate;

    // Make a "Price" object
    var price = new Price(".price", rate);
    price.convert();
  });
}
