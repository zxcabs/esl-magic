//Core.js
//EventMachine
(function () {
	var rz = window._rz_;
	if (!rz || rz.core) return false;
	
	var host = window.location.host;
	var path = window.location.pathname;
	var util = rz.util;

	//EventMachine
	function EventMachine (opt) {
		this._opt = opt || {};
		this._sub = {};
		this._pub = [];
		
		this._proc();
	};
	
	//Emit event 
	EventMachine.prototype.emit = function (name, data) {
		if (name && typeof(name) == 'string') {
			this._pub.push({n: name, d: data});
		};
	};
	
	//Listen event
	EventMachine.prototype.on = function (name, callback) {
		if (name && typeof(name) == 'string' && callback && typeof(callback) == 'function') {
			var subarr = this._sub[name] = this._sub[name] || new Array();
			subarr.push(callback);
		};
	};
	
	EventMachine.prototype._tick = function (callback) {
		var arr = this._pub;
		this._pub = new Array();
		
		var tack = function (callback) {
			var e = arr.shift();
			
			if (e) {
				if (this._sub[e.n]) {
					var subarr = this._sub[e.n];
					
					for (var i in subarr) {
						if (subarr[i] && !subarr[i](e.d)) break;
					}
				};
				
				delete (e);
				setTimeout(function() {tack.call(this, callback)}.bind(this), 0);
			} else {
				delete (arr);
				return (callback)? callback.call(this): null;
			};
		};
		
		tack.call(this, callback);
	};
	
	EventMachine.prototype._proc = function () {
		setTimeout(function() {
			this._tick(this._proc);
		}.bind(this), 0);
	};
	///////////EventMachine
	
	
	//Core
	function Core (opt) {
		this._opt = opt || {};
		if (!this._opt.host || this._opt.host && !this._opt.host.match(/esl\.eu/gi) || 
			!this._opt.path || this._opt.path && !this._opt.path.match(/rankings/gi)) {
			return null;
		};
		
		this.version = '0.3a';
		this._opt.updateInterval = this._opt.updateInterval || 60 * 1000; //15sec for test
		this._em = new EventMachine();
		
		//TODO: type must bee get on host
		this._type = 'ESL';
		this._dataprov = new rz.Datas[this._type]({core: this});
		this._viewprov = new rz.Views[this._type]({core: this});

		this.on('endParse', this._proc.bind(this));
		this.include('http://esl.redzerg.ru/style/'+ this._type.toLowerCase() +'.css');
		this._ready();
	};
	
	//private
	Core.prototype._ready = function (data) {
		this.emit('coreReady', "some data");
		this.emit('getData');
		this.log('ready');
	};
	
	Core.prototype._proc = function () {
		setTimeout(function () {
			this.emit('getData');
		}.bind(this), this._opt.updateInterval);
	};
	///////////private
	
	//public
	Core.prototype.__defineGetter__('host', function(){
		return this._opt.host;
	});
	
	Core.prototype.__defineGetter__('path', function(){
		return this._opt.path;
	});
	
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
	Core.prototype.include = rz.include;
	
	//overwrite!!
	Core.prototype.ready = function (data) {
		//this.log('ready(). Overwrite this method!')
	};
	/////////overwrite
	////////////////////////Core
	
	rz.CCore = Core;
	rz.core = new Core({host: host, path: path});
	rz.scriptLoaded('Core', Core);
})();