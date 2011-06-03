//ViewProvider.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.ViewProvider) return false;
	
	var $ = window.jQuery;
	
	function ViewProvider(opt) {
		this._opt = opt || {};
	};
	
	ViewProvider.prototype._createContainer = function (o) {
	};
	
	ViewProvider.prototype.log = function (msg) {rz.log('ViewProvider: ' + msg)};
	ViewProvider.prototype.error = function (msg) {rz.error('ViewProvider error: ' + msg)};
	
	rz.scriptLoaded('ViewProvider', ViewProvider);
})();