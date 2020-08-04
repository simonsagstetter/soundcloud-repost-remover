var actionsActive;
var isPosts;
var isReposts;
var toastShown;

var rootObserver = new MutationObserver( function( mutations, me ) {
		var content = document.getElementById("content");

		if ( content ) {
				content.addEventListener( "DOMSubtreeModified", function() {
					if ( window.location.pathname == "/stream" ) {
						if(! actionsActive ) {
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
		var lContent = document.getElementsByClassName( "l-content" );
		if ( sounds.length > 0 && soundsList.length > 0 && lContent.length > 0) {
			insertToast();
			handleCanvas( sounds, soundsList[0], lContent );
			me.disconnect();
			return;
		}
	});

	observer.observe(document, {
		childList: true,
		subtree: true
	});

	function handleCanvas( sounds, soundsList, lContent ) {
		var isActive;

		chrome.storage.sync.get( ['isActive'], function( result ) {
			isActive = result.isActive;
			if ( isActive ) {
				chrome.storage.sync.get( ['isPosts'], function( result ) {
					isPosts = result.isPosts;
					if ( isPosts ) {
						isReposts = false;
					}
					else {
						isReposts = true;
					}
					insertTabBar( lContent );
					removeReposts( sounds );
					removeRepostsOnScroll( soundsList );
				});
			}
		});
	};

	function toggleTab(e) {
		let tabs = document.getElementsByClassName( "sce-tab" );
		let target = e.currentTarget;

		if( target.dataset["id"] == "reposts" ) {
			chrome.storage.sync.set( { isPosts: false, isReposts: true }, function() {
				isPosts = false;
				isReposts = true;
				switchClasses( tabs, "reposts" );

			});
		}
		else {
			chrome.storage.sync.set( { isPosts: true, isReposts: false }, function() {
				isPosts = true;
				isReposts = false;
				switchClasses( tabs, "posts" );
			});
		}

	};

	function switchClasses( tabs, tabId ) {
		let sounds = document.getElementsByClassName("soundList__item");
		if ( tabId == "reposts" ) {
			tabs[0].setAttribute( "class", "sce-tab" );
			tabs[1].setAttribute( "class", "sce-tab sce-tab-active" );
		}
		else {
			tabs[0].setAttribute( "class", "sce-tab sce-tab-active" );
			tabs[1].setAttribute( "class", "sce-tab" );
		}

		if( isPosts ) {
			for ( var i = 0; i < sounds.length; i++ ) {
				try {
					if( sounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
						sounds[i].style.display = "none";
					}
					else {
						sounds[i].style.display = "block";
					}
				}
				catch ( e ) {
					sounds[i].style.display = "block";
				}
			}
		}
		else {
			for ( var i = 0; i < sounds.length; i++ ) {
				try {
					if( sounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
						sounds[i].style.display = "block";
					}
					else {
						sounds[i].style.display = "none";
					}
				}
				catch ( e ) {
					sounds[i].style.display = "none";
				}
			}
		}
		window.scrollTo(0,0);
	};

	function removeReposts( sounds ) {
		let postCounter = 0;
		let repostCounter = 0;
			for ( let i = 0; i < sounds.length; i++ ) {
					if ( isPosts ) {
						try {
							if( sounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
								sounds[i].style.display = "none";
								repostCounter++;
							}
						}
						catch ( e ) {
							sounds[i].style.display = "block";
						}
					}
					else {
						try {
							if( sounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
								sounds[i].style.display = "block";
								repostCounter++;
							}
						}
						catch ( e ) {
							sounds[i].style.display = "none";
						}
					}
			}
			let tabs = document.getElementsByClassName( "sce-tab" );
			tabs[0].children[0].innerHTML = postCounter;
			tabs[1].children[0].innerHTML=  repostCounter;
			if (! toastShown ) {
				toastShown = true;
				showToast();
			}
	};

	function removeRepostsOnScroll( soundsList ) {
		soundsList.addEventListener( "DOMNodeInserted", function ( event ) {
		let newSounds = document.getElementsByClassName( "soundList__item" );
		let postCounter = 0;
		let repostCounter = 0;
		for ( var i = 0; i < newSounds.length; i++ ) {
				if ( isPosts ) {
					try {
						if( newSounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
							newSounds[i].style.display = "none";
							repostCounter++;
						}
					}
					catch ( e ) {
						newSounds[i].style.display = "block";
						postCounter++;
					}
				}
				else {
					try {
						if( newSounds[i].children[0].children[0].children[0].children[1].children[2].classList.contains("soundContext__repost") ) {
							newSounds[i].style.display = "block";
							repostCounter++;
						}
					}
					catch ( e ) {
						newSounds[i].style.display = "none";
						postCounter++;
					}
				}
		}
			let tabs = document.getElementsByClassName( "sce-tab" );
			tabs[0].children[0].innerHTML = postCounter;
			tabs[1].children[0].innerHTML=  repostCounter;
		}, false);
	};

	function insertTabBar( lContent ) {

		if ( document.getElementsByClassName("sce-tab-bar-container").length < 1 ) {
			let div1 = document.createElement("div");
			div1.setAttribute( "class", "sce-tab-bar-container" );
			let div2 = document.createElement("div");
			div2.setAttribute( "class", "sce-tab-bar" );
			div1.appendChild( div2 );
			let ul = document.createElement("ul");
			ul.setAttribute( "class", "sce-tabs" );
			div2.appendChild( ul );
			let li1 = document.createElement("li");
			li1.innerHTML = "Posts ";
			li1.setAttribute(["data-id"], "posts");
			li1.addEventListener( "click", function(e) { toggleTab(e); } );
			let li2 = document.createElement("li");
			li2.innerHTML = "Reposts ";
			li2.setAttribute(["data-id"], "reposts");
			li2.addEventListener( "click", function(e) { toggleTab(e); } );
			if ( isPosts ) {
				li1.setAttribute( "class", "sce-tab sce-tab-active" );
				li2.setAttribute( "class", "sce-tab" );
			}
			else {
				li1.setAttribute( "class", "sce-tab" );
				li2.setAttribute( "class", "sce-tab sce-tab-active" );
			}
			let span1 = document.createElement("span");
			li1.appendChild( span1 );
			let span2 = document.createElement("span");
			li2.appendChild( span2 );
			ul.appendChild( li1 );
			ul.appendChild( li2 );
			lContent[1].insertBefore( div1, lContent[1].children[0] );
		}
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

	function showToast() {
		clearTimeout( timer );
		let toast = document.getElementById( "sce-toast" );
		toast.childNodes[1].innerHTML = "Extension is <div class='sce-counter'>active</div>";
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
