//Core.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.core) return false;
	
	var host = window.location.host;
	var $=jQuery = window.jQuery;
	
	function Core (opt) {
		this._opt = opt || {};
		if (!this._opt.host && !this._opt.host.match(/esl\.eu$/gi)) return null;
		
		this._em = null;

		if (!$ || ($ && $.fn && parseFloat($.fn.jquery) < 1.5)) {
			rz.include('http://code.jquery.com/jquery-1.6.1.min.js');
		};
		
		rz.include('http://esl.redzerg.ru/js/EventMachine.js', function (EventMachine) {
			this._em = new EventMachine();
			this._em.on('coreLoad', this.load);
			this._em.emit('coreLoad', "some data");
		}.bind(this));
	};
	
	Core.prototype.load = function (data) {
		alert('Load ' + data);
	};
	
	rz.core = new Core({host: host});
	rz.scriptLoaded('Core');
})();