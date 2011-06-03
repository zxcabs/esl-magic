//ViewProvider.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.ViewProvider) return false;
	
	var $ = window.jQuery;
	
	function ViewProvider(opt) {
		if (!opt && !opt.core && !(opt.core instanceof rz.CCore)) {
			this.error('Core undefined');
			return false;
		};
		
		this._opt = opt || {};
		this._core = this._opt.core;
		
		//TODO: complite !!!!!!!!!!!!!
	};
	
	ViewProvider.prototype._createContainer = function (o) {
	};
	
	ViewProvider.prototype.log = function (msg) {rz.log('ViewProvider: ' + msg)};
	ViewProvider.prototype.error = function (msg) {rz.error('ViewProvider error: ' + msg)};
	
	rz.scriptLoaded('ViewProvider', ViewProvider);
})();