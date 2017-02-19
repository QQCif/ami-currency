'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

chrome.runtime.onStartup.addListener(function () {
  console.log('Starting browser... updating rate.');

  chrome.storage.local.get({
    currency: 'USD'
  }, function (items) {
    currencyConvert(items.currency);
  });
});
