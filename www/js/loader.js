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
		if (name && _scriptLoadEvents[name]) _scriptLoadEvents[name](data);
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
				if (callback && typeof(callback) == 'function') {
					name = (url.match(/\w+\.\w+$/i))? url.match(/\w+\.\w+$/i)[0].replace(/\.\w+$/i, ''): 'unknown';
					_scriptLoadEvents[name] = callback;
				};
				
				el = document.createElement('script');
				el.type='text/javascript';
				el.charset='utf8';
				el.src=url;
				getContainer().appendChild(el);
				break;
			case '.css':
				//TODO: need do?
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
		alert(msg);
	};
	
	rz.getContainer = getContainer;
	rz.include = include;
	rz.loader = loader;
	rz.log = log;
	rz.scriptLoaded = scriptLoaded;

	loader();
})();