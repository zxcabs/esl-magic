//DataProvider.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.DataProvider) return false;
	
	var $ = window.jQuery;
	
	function DataProvider (opt) {
		if (!opt && !opt.core && !(opt.core instanceof rz.CCore)) {
			this.error('Core undefined');
			return false;
		};

		this._opt = opt;
		this._core = this._opt.core;
		
		this._data = {};
		
		if(this['_getData' + this._opt.type] && this['_parseData' + this._opt.type]) {
			this._getData = this['_getData' + this._opt.type];
			this._parseData = this['_parseData' + this._opt.type];
		} else {
			this.error('Wrong type!');
		};
		
		this._core.on('getData', this._getData.bind(this));
		this._core.on('endLoad', this._parseData.bind(this));
		
		this._ready();
	};
	
	DataProvider.prototype._ready = function () {
		this._core.emit('dataprovReady');
		this.log('ready.');
	};
	
	DataProvider.prototype._getData = function () {this.error('getData(),  doesn\'t select!')};
	DataProvider.prototype._parseData = function () {this.error('parseData(),  doesn\'t select!')};
	
	DataProvider.prototype._getDataESL = function () {
		this.log('_getDataESL');
		
		$.ajax({
				url: this._core.path,
				type: 'html'
			}
		).done(function (data) {
				this._core.emit('endLoad', data.replace(/<!DOCTYPE.*>|\n{1,}|\r|\s{2,}|\t{1,}/gi, ''))
			}.bind(this)
		).fail(function () {
			this.error('load faild');
			this._core.emit('endParse');
		}.bind(this));
	};
	
	DataProvider.prototype._parseDataESL = function (data) {
		this.log('parseDataESL');
		
		var $main = $('#main_content', $(data));
		var $tables = $('table', $main);
		
		if ($tables && $tables[0] && $tables[1]) {
			var t0 = $($tables[0]),
				t1 = $($tables[1]);
			
			this._parseESLTable('t0', t0, function () {
				this._parseESLTable('t1', t1, function () {
					this._core.emit('endParse');
				}.bind(this));
			}.bind(this));
		} else {
			this.error('no parse data');
			this._core.emit('endParse');
		};
	};
	
	DataProvider.prototype._parseESLTable = function (name, $tbl, callback) {
		this.log('parse ESL table: ' + name);
		
		if ($tbl) {
			
			var $trs = $('tr', $tbl);
			var rcount = $('td.TextS', $trs[0]).length;
			
			//TODO: async parse
			for (var i = 2; i < $trs.length; i++) {
				var $tds = $('td', $trs[i]);
				var r = rcount - (parseInt($($tds[$tds.length - 1]).attr('colspan')) / 2)  + 1;
				//TODO: parse
				r;
			}
			
		} else {
			this.error('table ' + name + ' is null');
		};
		
		if (callback) setTimeout(callback, 0);
		return;
	};
	
	DataProvider.prototype.log = function (msg) {rz.log('DataProvider: ' + msg)};
	DataProvider.prototype.error = function (msg) {rz.error('DataProvider error: ' + msg)};

	rz.scriptLoaded('DataProvider', DataProvider);
})();