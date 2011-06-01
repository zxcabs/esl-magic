//Core.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.core) return false;
	
	var host = window.location.host;
	var $=jQuery = window.jQuery;
	
	
	//Core
	function Core (opt) {
		this._opt = opt || {};
		//Uncomment this 
		// if (!this._opt.host || this._opt.host && !this._opt.host.match(/esl\.eu/gi)) {
			// return null;
		// }
		
		this._em = null;

		rz.include('http://esl.redzerg.ru/js/EventMachine.js', function (EventMachine) {
			this._em = new EventMachine();
			this._em.on('coreReady', this.ready.bind(this));
			this._em.emit('coreReady', "some data");
		}.bind(this));
	};
	
	Core.prototype.emit = function (name, data) {
		if (this._em) {
			this._em.emit(name, data);
		} else {
			this.error('EventMachine not found');
		};
	};
	
	Core.prototype.ready = function (data) {
		this.log('ready. Data: ' + data);
	};
	
	//
	Core.prototype.log = function (msg) {
		rz.log('Core: ' + msg);
	};
	
	Core.prototype.error = function (msg) {
		rz.error('Core error: ' + msg);
	};
	////////////////////////
	
	rz.core = new Core({host: host});
	rz.scriptLoaded('Core');
})();