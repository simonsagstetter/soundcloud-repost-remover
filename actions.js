var actionsActive;

var rootObserver = new MutationObserver( function( mutations, me ) {
		var content = document.getElementById("content");

		if ( content ) {
				content.addEventListener( "DOMSubtreeModified", function() {
					if ( window.location.pathname == "/stream" ) {
						if(! actionsActive ) {
							console.log( "Path is /stream." );
							actionsActive = true;
							init( content );
						}
					}
					else {
						actionsActive = false;
					}
				});

			me.disconnect();
			return;
		};
});

rootObserver.observe(document, {
	childList: true,
	subtree: true
});

function init( content ) {
	var timer;
	var observer = new MutationObserver( function ( mutations, me ) {
		var sounds = document.getElementsByClassName( "soundList__item" );
		var soundsList = document.getElementsByClassName( "lazyLoadingList__list" );
		if ( sounds.length > 0 && soundsList.length > 0 ) {
			console.log( "DOM Elements available." );
			insertToast();
			handleCanvas( sounds, soundsList[0] );
			me.disconnect();
			return;
		}
	});

	observer.observe(document, {
		childList: true,
		subtree: true
	});

	function handleCanvas( sounds, soundsList ) {
		var isActive;

		chrome.storage.sync.get( ['isActive'], function( result ) {
			isActive = result.isActive;
			if ( isActive ) {
				removeReposts( sounds );
				removeRepostsOnScroll( soundsList );
				console.log( "Soundcloud Repost Remover is active." );
			}
			else {
				console.log( "Soundcloud Repost Remover not activated yet." );
			}
		});
	};

	function removeReposts( sounds ) {
				for ( var i = 0; i < sounds.length; i++ ) {
					try {
						if( sounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
							sounds[i].remove();
						}
					}
					catch ( e ) {
					}
				}
	};

	function removeRepostsOnScroll( soundsList ) {
		soundsList.addEventListener( "DOMNodeInserted", function ( event ) {
		let newSounds = document.getElementsByClassName( "soundList__item" );
			for ( var i = 0; i < newSounds.length; i++ ) {
				try {
					if( newSounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
						newSounds[i].remove();
					}
				}
				catch ( e ) {
				}
			}
			showToast( newSounds.length );
		}, false);
	};

	function insertToast() {
		if (! document.getElementById("sce-toast") ) {
			let div = document.createElement("div");
			div.setAttribute( "id", "sce-toast" );
			document.getElementsByTagName("body")[0].insertBefore(div, document.getElementsByTagName("body")[0].children[0]);
			let small = document.createElement("small");
			small.innerHTML = "Soundcloud Repost Remover";
			div.appendChild(small);
			let span = document.createElement("span");
			span.innerHTML = "";
			div.appendChild(span);
		}
	};

	function showToast( length ) {
		clearTimeout( timer );
		let toast = document.getElementById( "sce-toast" );
		toast.childNodes[1].innerHTML = "Removed <div class='sce-counter'>" + length + "</div> reposts from the stream.";
		toast.style.opacity = 1;
		toast.style.transform = "scaleY(1)";
		toast.style.top = "60px";

		timer = setTimeout( function() {
			hideToast();
		}, 5000 );

	}

	function hideToast() {
		let toast = document.getElementById( "sce-toast" );
		toast.style.opacity = 0;
		toast.style.transform = "scaleY(0)";
		toast.style.top = "30px";
	}
};
