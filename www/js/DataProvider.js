//DataProvider.js
(function () {
		var rz = window._rz_;
	if (!rz || rz.DataProvider) return false;
	
	function DataProvider (opt) {
		this._opt = opt || {};
	};

	rz.scriptLoaded('DataProvider', DataProvider);
})();