//Core.js
//EventMachine
(function () {
	var rz = window._rz_;
	if (!rz || rz.core) return false;
	
	var host = window.location.host;
	var path = window.location.pathname;
	var jQuery = window.jQuery;
	
	
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
		
		this._opt.updateInterval = this._opt.updateInterval || 15000; //15sec for test
		
		this._em = null;
		this._dataprov = null;
		this._viewprov = null;
		//TODO: type must bee get on host
		this._type = 'ESL';
		
		if (!jQuery || jQuery && parseInt(jQuery.fn.jquery.replace(/\./g, '')) < 151) {
			this.include('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');
		}

		this._em = new EventMachine();
		
		this.on('endParse', this._proc.bind(this));
		
		//TODO: this is for test, remove it!
		//this.on('parseMatch', function(o) { this.log(o.tName + ' - '+ o.mathId + ' - ' + o.playerHTML) }.bind(this));
		
		this.include('http://esl.redzerg.ru/js/DataProvider.js', function (DataProvider) {
			this._dataprov = new DataProvider({core: this, type: this._type});
			if (this._viewprov) this._ready();
		}.bind(this));
		
		this.include('http://esl.redzerg.ru/js/ViewProvider.js', function (ViewProvider) {
			this._viewprov = new ViewProvider({core: this, type: this._type});
			if (this._dataprov) this._ready();
		}.bind(this));
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
	Core.prototype.include = function (url, callback) {rz.include(url, callback)};
	
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