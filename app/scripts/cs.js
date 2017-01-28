var localCurrencyCode = "CNY";
function currencyConvert(locale) {
  var currency_input = 1;
  var currency_from = "JPY"; // currency codes : http://en.wikipedia.org/wiki/ISO_4217
  var currency_to = locale;
  // http://stackoverflow.com/questions/3139879/how-do-i-get-currency-exchange-rates-via-an-api-such-as-google-finance/16408368#16408368
  var yql_base_url = "https://query.yahooapis.com/v1/public/yql";
  var yql_query = 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20("'+currency_from+currency_to+'")';
  var yql_query_url = yql_base_url + "?q=" + yql_query + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

  var rate =0;

  // Fire Ajax using GET method
  $.get( yql_query_url, function( data ) {
    rate = data.query.results.rate.Rate;

    // Find price
    if($(".off_price").length) {
      var price = $(".price")[0].childNodes[1].nodeValue.trim();
      var localPrice = Math.trunc(trimPrice(price) * rate);
      $(".price")[0].childNodes[1].nodeValue = localPrice + "\u00A0CNY";
    } else {
      var price = $(".price").text().trim();
      var localPrice = Math.trunc(trimPrice(price) * rate);
      $(function () {
        $(".price").fadeOut(200, function () {
          $(this).text(localPrice + "\u00A0CNY").fadeIn(200);
        });
      });
    }
  });

  // Remove separator and JPY
  function trimPrice(string) {
    return string.replace(/,/g,"").slice(0,-4);
  }
}
currencyConvert(localCurrencyCode);
