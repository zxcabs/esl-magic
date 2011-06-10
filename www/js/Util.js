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
	
	rz.util = util;
	rz.scriptLoaded('Util', util);
})();