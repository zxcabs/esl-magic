//Core.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.core) return false;
	
	var host = window.location.host;
	var jQuery = window.jQuery;
	
	
	//Core
	function Core (opt) {
		this._opt = opt || {};
		//Uncomment this 
		// if (!this._opt.host || this._opt.host && !this._opt.host.match(/esl\.eu/gi)) {
			// return null;
		// }
		
		this._em = null;
		this._dataprov = null;
		
		if (!jQuery || jQuery && parseInt(jQuery.fn.jquery.replace(/\./g, '')) < 151) {
			this.include('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');
		}

		this.include('http://esl.redzerg.ru/js/EventMachine.js', function (EventMachine) {
			this._em = new EventMachine();
			this.on('coreReady', this._ready.bind(this));
			
			this.include('http://esl.redzerg.ru/js/DataProvider.js', function (DataProvider) {
				this._dataprov = new DataProvider();
				this.emit('coreReady', "some data");
			}.bind(this));
		}.bind(this));
	};
	
	//private
	Core.prototype._ready = function (data) {
		this.log('ready');
		this.ready(data);
	};
	///////////private
	
	//public
	Core.prototype.on = function (name, callback) {
		if (this._em) {
			this._em.on(name, callback);
		} else {
			this.error('EventMachine not found');
		};
	};
	
	Core.prototype.emit = function (name, data) {
		if (this._em) {
			this._em.emit(name, data);
		} else {
			this.error('EventMachine not found');
		};
	};
	
	Core.prototype.log = function (msg) {rz.log('Core: ' + msg)};
	Core.prototype.error = function (msg) {rz.error('Core error: ' + msg)};
	Core.prototype.include = function (url, callback) {rz.include(url, callback)};
	
	//overwrite!!
	Core.prototype.ready = function (data) {
		//this.log('ready(). Overwrite this method!')
	};
	/////////overwrite
	////////////////////////Core
	
	rz.core = new Core({host: host});
	rz.scriptLoaded('Core');
})();