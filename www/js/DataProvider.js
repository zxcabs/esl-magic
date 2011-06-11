//DataProvider.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.DataProvider) return false;
	
	var $ = window.jQuery;
	var util = rz.util;
	
	//Base class
	function DataProvider (opt) {
		if (!opt && !opt.core && !(opt.core instanceof rz.CCore)) {
			this.error('Core undefined');
			return false;
		};

		this._opt = opt;
		this._core = this._opt.core;
		this._core.on('getData', this._getData.bind(this));
		this._core.on('endLoad', this._parseData.bind(this));
		this._core.on('parseMatch', this._onParseMatch.bind(this));
		
		this._data = {};
		this._isInit = {};
		
		this._ready();
	};
	
	DataProvider.prototype._ready = function () {
		this._core.emit('dataprovReady');
		this.log('ready.');
	};
	
	DataProvider.prototype._getData = function () {this.error('getData(),  doesn\'t overwritten!')};
	DataProvider.prototype._parseData = function () {this.error('parseData(),  doesn\'t overwritten!')};
	DataProvider.prototype._onParseMatch = function (match) {
		var tm = this._data[match.tName] = this._data[match.tName] || {};
		var m = tm[match.matchId] = tm[match.matchId] || new Match({
													core  : this._core,
													id    : match.matchId,
													tName : match.tName,
													round : match.round,
													next  : match.matchNext,
													isLast: (match.round == match.totalRound)
												});
		
		m.setPlayer({id: match.playerId, html: match.playerHTML, winner: match.playerWinner});
		
		if (match.vId) {
			m = tm[match.vId];
			m.setLink(match.vHTML);
		};
	};
	
	DataProvider.prototype.log = function (msg) {rz.log('DataProvider: ' + msg)};
	DataProvider.prototype.error = function (msg) {rz.error('DataProvider error: ' + msg)};
	///////Base class
	
	//ESL
	function ESLData (opt) {
		DataProvider.apply(this, arguments);
	};
	util.inherits(ESLData, DataProvider);
	
	ESLData.prototype._getData = function () {
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
	
	ESLData.prototype._parseData = function (data) {
		this.log('parseDataESL');
		
		var $main = $('#main_content', $(data));
		var $tables = $('table', $main);
		
		if ($tables && $tables[0]) {
			var t0 = $($tables[0]),
				t1 = ($tables[1])? $($tables[1]): null;
			
			this._parseESLTable('t0', t0, function () {
				if (t1) {
					this._parseESLTable('t1', t1, function () {
						this._core.emit('endParse');
					}.bind(this));
				} else {
					this._core.emit('endParse');
				};
			}.bind(this));
		} else {
			this.error('no parse data');
			this._core.emit('endParse');
		};
	};
	
	ESLData.prototype._parseESLTable = function (name, $tbl, callback) {
		this.log('parse ESL table: ' + name);
		
		if ($tbl) {
			
			var $trs = $('tr', $tbl);
			var rcount = $('td.TextS', $trs[0]).length;
			
			if (!this._isInit[name]) {
				this._core.emit('initTable', {name: name, roundCount: rcount});
				this._isInit[name] = true;
			};
			
			//round cof, need to calculate math number in round
			var rk = new Array();
			
			//init round cof
			for(var i = 0; i < rcount; i++) {
				rk[i] = -1;
			};
			
			var mrnum = {};
			var mnum = {};
			
			util.asyncEach($trs, function ($tr, i) {
				if (i < 2) return true;
				
				var $tds = $('td', $tr);
				var round = rcount - (parseInt($($tds[$tds.length - 1]).attr('colspan')) / 2)  + 1;
				var k = rk[round-1] = -rk[round-1];
				var mid = i + k * Math.pow(2, round - 1);
				var j = (round <= 2)? round - 1: 2;
				var v = (j != 0)? j - 1: null; 
				var mnk = mid;
				
				if (!mnum[mid]) {
					mnum[mid] = mid;
					mrnum[round] = (!mrnum[round])? 1: mrnum[round] + 1;
				}				
				
				var nextM = mid + ((mrnum[round] % 2 != 0)? 1: -1) * Math.pow(2, round);
				
				var o = {
					tName       : name,
					matchId     : mid,
					matchNext   : nextM,
					round       : round,
					totalRound  : rcount,
					playerId    : i,
					playerHTML  : $('div', $tds[j]).html(),
					playerWinner: ($($tds[j]).hasClass('TextMB'))? true: false
				};
				
				if (v != null) {
					o['vId'] = i;
					o['vHTML'] = $('a', $tds[v]).parent().html();
				};
			
				this._core.emit('parseMatch', o);
			}.bind(this));
		} else {
			this.error('table ' + name + ' is null');
		};
		
		if (callback) setTimeout(callback, 0);
		return;
	};
	////////////ESL
	
	//Match
	function Match (opt) {
		if (!opt && !opt.core && !(opt.core instanceof rz.CCore)) {
			this.error('Core undefined');
			return false;
		};
		
		this._core = opt.core;
		this.id = opt.id;
		this.tName = opt.tName;
		this.round = opt.round;
		this.next = opt.next;
		this.isLast = opt.isLast;
		
		this.link = null;
		
		this.plrs = {};
		
		this._setCount = 0;
	};
	
	Match.prototype.setPlayer = function (player) {
		var pl = this.plrs[player.id];
		
		if (!pl) {
			pl = {id: player.id, html: player.html, winner: player.winner, match: this};
			this.plrs[player.id] = pl;
			this._setCount++;
		} else if (pl.html !== player.html || pl.winner != player.winner) {
			pl.html = player.html;
			pl.winner = player.winner;
			this._core.emit('updateMatch', pl);
		};
		
		//new match ready
		if (this._setCount == 2 || this.isLast && this._setCount != -1) {
			this._setCount = -1;
			this._core.emit('newMatch', this);
		};
	};
	
	Match.prototype.setLink = function (html) {
		if (!this.link) {
			this.link = html;
		};
	};	
	
	Match.prototype.log = function (msg) {rz.log('Match (' + this._id + '): ' + msg)};
	Match.prototype.error = function (msg) {rz.error('Match (' + this._id + ') error: ' + msg)};
	/////////////Match
	rz.Datas = {
		ESL: ESLData
	};
	rz.scriptLoaded('DataProvider');
})();