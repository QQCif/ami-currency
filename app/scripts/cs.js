'use strict';

chrome.storage.local.get({
  currency: 'USD'
}, function (items) {
  const currency = items.currency;
  console.log('Currency is ' + currency);

  chrome.storage.local.get('rate', function (items) {
    const rate = items.rate;
    console.log('Readed rate is: ' + rate);
    // Make a "Price" object
    const price = new Price('.price', rate, currency);
    price.convert(currency);

    const sellingPrice = new Price('.selling_price', rate, currency);
    sellingPrice.convert(currency);
  });
});
