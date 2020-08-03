window.onload = function ( e ) {

	console.log( "Loaded" );

	// Doc VARs
	var activateFeature = document.getElementById("activateFeature");
	var deactivateFeature = document.getElementById("deactivateFeature");

	// Runtime VARs
	var isActive = null;

	// Get Value
	chrome.storage.sync.get(['isActive'], function(result) {
		// Assign value
		isActive = result.isActive;

		// Display buttons on callback
		if ( isActive ) {
			activateFeature.style.display = "none";
			deactivateFeature.style.display = "block";
		}
		else {
			activateFeature.style.display = "block";
			deactivateFeature.style.display = "none";
		}
	});

	function refresh() {
		chrome.tabs.query( {active: true, currentWindow: true}, function( tabs ) {
			chrome.tabs.reload(
				tabs[0].id
			);
		});
	}

	function setValue( value ) {
		chrome.storage.sync.set( { isActive: value }, refresh() );
	}

	activateFeature.onclick = function( element ) {
		isActive = true;
		setValue( isActive );
		activateFeature.style.display = "none";
		deactivateFeature.style.display = "block";
	}

	deactivateFeature.onclick = function( element ) {
		isActive = false;
		setValue( isActive );
		activateFeature.style.display = "block";
		deactivateFeature.style.display = "none";
	}
}
