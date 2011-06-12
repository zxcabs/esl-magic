(function () {
	var rz = window._rz_;
	if (!rz) return false;
	
	var util = {};
	
	util.inherits = function(ctor, superCtor) {
		ctor.super_ = superCtor;
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: { value: ctor, enumerable: false }
		});
	};
	
	util.asyncEach = function (arr, callback) {
		if (!arr && !arr.slice || typeof callback != 'function') return false;
		
		var a = arr.slice(0);
		var n = 0;
		
		var getE = function () {
			//no good, but need...
			var e = a[n];
			
			if (e && callback(e, n) != false) {
				n += 1;
				setTimeout(getE, 0);
			};
			
		};
		
		getE();
		delete a;
	};
	
	rz.util = util;
	rz.scriptLoaded('Util', util);
})();