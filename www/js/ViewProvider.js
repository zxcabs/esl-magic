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
		
		if(this['_init' + this._opt.type]) this._init = this['_init' + this._opt.type];
		if(this['_onParseMatch' + this._opt.type]) this._onParseMatch = this['_onParseMatch' + this._opt.type];
		
		this._core.on('parseMatch', this._onParseMatch.bind(this));
		this._init();
		//TODO: complite !!!!!!!!!!!!!
	};
	
	ViewProvider.prototype._init = function () {this.error('init(): doesn`t selected!')};
	ViewProvider.prototype._onParseMatch = function () {this.error('onParseMatch doesn`t selected!')};
	ViewProvider.prototype._createContainer = function () {};
	
	ViewProvider.prototype._ready = function () {
		this._core.emit('viewprovReady');
		this.log('ready.');
	};
	
	ViewProvider.prototype._initESL = function () {
		var $t = $('#main_content table');
		$t.attr('style', '');
		$t.addClass('rz_table');
		$t.html('<div class="rz_head"></div><div class="rz_body">Идет загрузка...</div>');
		
		this._$t = {
			t0: $($t[0]),
			t1: $($t[1])
		};
		
		this._isInit = {t0: false, t1: false};
		
		this._ready();
	};
	
	ViewProvider.prototype._onParseMatchESL = function (o) {
		var $t = this._$t[o.tName];
		
		if (!this._isInit[o.tName]) {
			$('.rz_body', $t).html('');
			this._isInit[o.tName] = true;
		};
		
		var $r = $('.rz_body .rz_roundC' + o.round + ' .rz_matchC', $t);
		if ($('.rz_head .rz_round' + o.round, $t).length == 0) {
			var str = (o.round == o.totalRound)? 'Победитель': 
						(o.round == o.totalRound - 1)? 'Финал': 
							(o.round == o.totalRound - 2)? '1/2 финала':
								(o.round == o.totalRound - 3)? '1/4 финала': 'Раунд ' + o.round;
							
			var $rh = $('<span class="rz_round rz_round' + o.round + '">' + str + '</span>').appendTo($('.rz_head', $t));
			
			$rh.bind('click', o.round, function(e) {
				$('.rz_roundC', $t).hide();
				$('.rz_roundC' + e.data, $t).show();
			});
			
			if ($r.length == 0) {
				$r = $('<div class="rz_roundC rz_roundC'+ o.round +'"></div>').appendTo($('.rz_body', $t));
				if (o.round != 1) $r.hide();
				
				$('<div><h2>' + str + '</h2></div>').appendTo($r);
				$r = $('<div class="rz_matchC"></div>').appendTo($r);
			};
		};
		
		var $m = $('.rz_match' + o.matchId, $r);
		if ($m.length == 0) {
			$m = $('<span class="rz_match rz_match'+ o.matchId +'"></span>').appendTo($r);
			
			$('<div class="rz_vs"></div>').appendTo($m)
			if (o.round != o.totalRound) {
				$next = $('<div class="rz_next">&rArr;</div>').appendTo($m);
			}
			
		}
		
		
		var $p = $('.rz_player' + o.playerId + ' .rz_playerHTML', $r);
		if ($p.length == 0) {
			$p = $('<div class="rz_player rz_player'+ o.playerId +'"></div>').appendTo($m);
			
			$prev = $('<div class="rz_prev">' + ((o.round != 1)?'&lArr;': '&nbsp;' )+'</div>').appendTo($p);
			$p = $('<div class="rz_playerHTML"></div>').appendTo($p);
		}
		
		if (o.playerWinner) $p.addClass('TextMB');
		$p.html(o.playerHTML);
		
		if (o.vHTML) {
			$('.rz_match'+ o.vId +' .rz_vs', $t).html(o.vHTML);
		}
	};
	
	ViewProvider.prototype.log = function (msg) {rz.log('ViewProvider: ' + msg)};
	ViewProvider.prototype.error = function (msg) {rz.error('ViewProvider error: ' + msg)};
	
	rz.scriptLoaded('ViewProvider', ViewProvider);
})();