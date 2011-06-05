(function () {
	var rz = window._rz_;

	if (rz) {
		rz.log("already exists");
		return false;
	} else {
		rz = {};
		window._rz_ = rz;
	};
	
	var container = null;

	var _scriptLoadEvents = {};
	function scriptLoaded (name, data) {
		if (name && _scriptLoadEvents[name]) _scriptLoadEvents[name](data, name);
	};
	
	function getContainer () {
		if (!container) {
			container = document.getElementById('rzct');
			
			if (!container) {
				container = document.createElement('div');
				container.id = 'rz' + Math.random();
				document.body.appendChild(container);
			};
		};
		
		return container;
	};
	
	//include file on page
	function include(url, callback) {
		if (!url && typeof(url) != "string" && url.match(/\.\w+$/i)) return false;
		var type = url.match(/\.\w+$/i)[0];
		var name;
		var el;
		
		switch (type) {
			case '.js':
				name = (url.match(/[a-zA-Z0-9.-]+$/i))? url.match(/[a-zA-Z0-9.-]+$/i)[0].replace(/\.\w+$/i, ''): 'rz' + Math.random();
				if (callback && typeof(callback) == 'function') {
					_scriptLoadEvents[name] = callback;
				};
				
				el = document.createElement('script');
				el.type='text/javascript';
				el.charset='utf8';
				el.id=name;
				el.src=url;
				getContainer().appendChild(el);
				break;
			case '.css':
				el = document.createElement('link');
				el.type = 'text/css';
				el.href = url;
				el.rel = 'stylesheet';
				getContainer().appendChild(el);
				break;
			default:
				return false;
		};
		
		return true;
	};
	
	function loader () {
		include('http://esl.redzerg.ru/js/Core.js', function () {
			//alert('Go go');
		});
	};
	
	function log(msg) {
		if(console && console.log) console.log(msg);
	};
	
	function error(msg) {
		if(console && console.error) console.error(msg);
	};
	
	rz.getContainer = getContainer;
	rz.include = include;
	rz.loader = loader;
	rz.log = log;
	rz.error = error;
	rz.scriptLoaded = scriptLoaded;

	loader();
})();