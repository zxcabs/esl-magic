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
	var jQuery = window.jQuery;
	
	var _scriptLoadEvents = {};
	function scriptLoaded (name) {
		if (name && _scriptLoadEvents[name]) _scriptLoadEvents[name]();
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
				name = (url.match(/\w+\.\w+$/i))? url.match(/\w+\.\w+$/i)[0].replace(/\.\w+$/i, ''): 'unknown';
				_scriptLoadEvents[name] = callback;
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
		var host = window.location.host;
		if (!host && !host.match(/esl\.eu$/gi)) return false;

		if (!jQuery || (jQuery && jQuery.fn && parseFloat(jQuery.fn.jquery) < 1.5)) {
			include('http://code.jquery.com/jquery-1.6.1.min.js');
		};
		
		if (!rz.EM) {
			include('http://esl.redzerg.ru/js/EventMachine.js', function () {
				alert('EM load');
			});
		};
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