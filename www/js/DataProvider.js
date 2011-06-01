//DataProvider.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.DataProvider) return false;
	
	function DataProvider (opt) {
		if (!opt && !opt.core && !(opt.core instanceof rz.CCore)) {
			this.error('Core undefined');
			return false;
		};

		this._opt = opt;
		this._core = this._opt.core;
		
		if(this['_getData' + this._opt.type] && this['_parseData' + this._opt.type]) {
			this._getData = this['_getData' + this._opt.type];
			this._parseData = this['_parseData' + this._opt.type];
		} else {
			this.error('Wrong type!');
		};
		
		this._core.on('getData', this._getData.bind(this));
		
		this._ready();
	};
	
	DataProvider.prototype._ready = function () {
		this._core.emit('dataprovReady');
		this.log('ready.');
	};
	
	DataProvider.prototype._getData = function () {this.error('getData(),  doesn\'t select!')};
	DataProvider.prototype._parseData = function () {this.error('_parseData(),  doesn\'t select!')};
	
	DataProvider.prototype._getDataESL = function () {
		this.log('get esl data');
		this._core.emit('loadData');
	};
	
	DataProvider.prototype._parseDataESL = function () {
		this.log('parseDataESL');
	};
	
	DataProvider.prototype.log = function (msg) {rz.log('DataProvider: ' + msg)};
	DataProvider.prototype.error = function (msg) {rz.error('DataProvider error: ' + msg)};

	rz.scriptLoaded('DataProvider', DataProvider);
})();