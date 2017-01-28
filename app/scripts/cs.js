function submitPrice() {
  var currency_input = 1;
  var currency_from = "JPY"; // currency codes : http://en.wikipedia.org/wiki/ISO_4217
  var currency_to = "CNY";

  var yql_base_url = "https://query.yahooapis.com/v1/public/yql";
  var yql_query = 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20("'+currency_from+currency_to+'")';
  var yql_query_url = yql_base_url + "?q=" + yql_query + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

  var op_data =0;
  httpGetAsync(yql_query_url, calcLocalCurrency);
}

function httpGetAsync (theUrl, callback) {
  var xhr = new XMLHttpRequest();
  var method = "GET";
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.response);
    }
  };
  xhr.open(method, theUrl, true); // true for asynchronous
  //if there's error
  xhr.onerror = function() {
    alert("There was an error.");
  };
  xhr.send();
}

function calcLocalCurrency(string) {
  var http_response_json = JSON.parse(string);
  var rate = http_response_json.query.results.rate.Rate;
  console.log(rate);
  function trimPrice(string) {
    return string.replace(/,/g,"").slice(0,-4);
  }

  if($(".off_price").length) {
    var price = $(".price")[0].childNodes[1].nodeValue.trim();
    var localPrice = Math.trunc(trimPrice(price) * rate);
    $(".price")[0].childNodes[1].nodeValue = localPrice + "\u00A0CNY";
  } else {
    var price = $(".price").text().trim();
    var localPrice = Math.trunc(trimPrice(price) * rate);
    $(function () {
      $(".price").fadeOut(500, function () {
        $(this).text(localPrice + "\u00A0CNY").fadeIn(500);
      });
    });
  }
}
submitPrice();
