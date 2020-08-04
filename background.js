'use strict';

	  chrome.runtime.onInstalled.addListener(function() {

			chrome.storage.sync.set( { isActive: false, isPosts: true, isReposts: false }, function() {
				console.log("Storage initiated.");
			});

			chrome.storage.sync.get(['isActive'], function(result) {
				let isActive = result.isActive;
				if ( isActive == false ) {
					console.log("Installtion succeeded!");
				}
				else {
					console.log("Error while storage initiation");
				}
			});

		chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		  chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
			  pageUrl: {hostEquals: 'soundcloud.com'},
			})
			],
				actions: [
					new chrome.declarativeContent.ShowPageAction()
				]
		  }]);
		  console.log( "Rules Added" );
		});

	});
