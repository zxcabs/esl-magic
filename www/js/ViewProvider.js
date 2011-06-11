//ViewProvider.js
(function () {
	var rz = window._rz_;
	if (!rz || rz.ViewProvider) return false;
	
	var $ = window.jQuery;
	var util = rz.util;
	
	//Base Class
	function ViewProvider(opt) {
		if (!opt && !opt.core && !(opt.core instanceof rz.CCore)) {
			this.error('Core undefined');
			return false;
		};
		
		this._opt = opt || {};
		this._core = this._opt.core;
		this._footer = '<div class="rz_head"></div><div class="rz_body">Идет загрузка...</div>' +
						'<div class="rz_footer">' + 
							'<div>Сетка автоматически обновляется каждые: ' + this._core._opt.updateInterval / 1000 + ' сек.</div>' +
							'<div><a href="http://esl.redzerg.ru">ESL Magic</a> - v: ' + this._core.version + '</div>' +
						'</div>';
		
		this._core.on('showMatch', this._showMatch.bind(this));
		this._core.on('initTable', this._onInitTable.bind(this));
		this._core.on('newMatch', this._onNewMatch.bind(this));
		this._core.on('updateMatch', this._onUpdateMatch.bind(this));
		
		this._init();
	};
	
	ViewProvider.prototype._init = function () {this.error('init(): doesn`t overwritten!')};
	ViewProvider.prototype._showMatch = function () {this.error('showMatch doesn`t overwritten!')};
	ViewProvider.prototype._onInitTable = function () {this.error('onInitTable doesn`t overwritten!')};
	ViewProvider.prototype._onNewMatch = function () {this.error('onNewMatch doesn`t overwritten!')};
	ViewProvider.prototype._onUpdateMatch = function () {this.error('onUpdateMatch doesn`t overwritten!')};
	
	ViewProvider.prototype._ready = function () {
		this._core.emit('viewprovReady');
		this.log('ready.');
	};
	
	ViewProvider.prototype.log = function (msg) {rz.log('ViewProvider: ' + msg)};
	ViewProvider.prototype.error = function (msg) {rz.error('ViewProvider error: ' + msg)};
	///////// Base class
	
	//ESL
	function ESLView (opt) {
		ViewProvider.apply(this, arguments);
		
		this._$dom = {};
	};
	util.inherits(ESLView, ViewProvider);
	
	ESLView.prototype._init = function () {
		var $t = $('#main_content table');
		$t.attr('style', '');
		$t.addClass('rz_table');
		$t.html(this._footer);
		
		this._$t = {
			t0: $($t[0]),
			t1: $($t[1])
		};
		
		this._isInit = {t0: false, t1: false};
		
		this._ready();
	};
	
	ESLView.prototype._onInitTable = function (o) {
		var $t = this._$t[o.name];
		var str, r, $th, $r, $mc;
		
		this._$dom[o.name] = {};
		
		$('.rz_body', $t).html('');
		
		for (r = 1; r <= o.roundCount; r++) {
			str = (r == o.roundCount)? 'Победитель': 
					(r == o.roundCount - 1)? 'Финал': 
						(r == o.roundCount - 2)? '1/2 финала':
							(r == o.roundCount - 3)? '1/4 финала': 'Раунд ' + r;
			
			$th = $('<span class="rz_round rz_round' + o.round + '">' + str + '</span>').appendTo($('.rz_head', $t));
			
			$th.bind('click', {tName: o.name, round: r, vp: this}, function (e) {
				e.data.vp._core.emit('showMatch', e.data);
			});
			
			$r = $('<div class="rz_roundC rz_roundC'+ r +'"></div>').appendTo($('.rz_body', $t));
			if (r != 1) $r.hide();
			$('<div><h2>' + str + '</h2></div>').appendTo($r);
			$mc = $('<div class="rz_matchC"></div>').appendTo($r);
			
			this._$dom[o.name][r] = {
										$: $r, 
										mc: { $: $mc }
									};
		};
	};
	
	ESLView.prototype._onNewMatch = function (match) {
		var $m, $r, mc, $next, $p, $prev;
		
		$r = this._$dom[match.tName][match.round].$;
		mc = this._$dom[match.tName][match.round].mc;
		
		$m = $('<span class="rz_match rz_match'+ match.id +'"></span>');		
		$('<div class="rz_vs">' + ((match.isLast)? '': match.link) + '</div>').appendTo($m);
		
		if (!match.isLast) {
			$next = $('<div class="rz_next">&rArr;</div>').appendTo($m);
			$next.bind('click', {tName: match.tName, round: match.round + 1, match: match.next, vp: this}, function (e) {
				e.data.vp._core.emit('showMatch', e.data);
			});
		};
		
		for (var p in match.plrs) {
			$p = $('<div class="rz_player rz_player'+ p +'"></div>');
			$prev = $('<div class="rz_prev">' + ((match.round != 1)?'&lArr;': '&nbsp;' )+'</div>').appendTo($p);			
			
			$prev.bind('click', {tName: match.tName, round: match.round - 1, match: p, vp: this}, function (e) {
				e.data.vp._core.emit('showMatch', e.data);
			});
			
			$('<div class="rz_playerHTML">' + match.plrs[p].html + '</div>').appendTo($p);
			$p.appendTo($m);
		}
		
		$m.appendTo($r);
		
		mc[match.id] = {$: $m};
	};

	ESLView.prototype._onUpdateMatch = function (player) {
		var $m, $p;
		$m = this._$dom[player.match.tName][player.match.round].mc[player.match.id].$;
		$p = $('.rz_player' + player.id + ' > .rz_playerHTML', $m);
		
		$m.addClass('rz_update').bind('mouseout', function () {
			$(this).removeClass('rz_update').unbind('mouseout');
		});
		
		$p.html(player.html);
	};
	
	ESLView.prototype._showMatch = function (e) {
		var mc;
		
		$('.rz_roundC', this._$t[e.tName]).hide();
		this._$dom[e.tName][e.round].$.show();
		
		if (typeof e.match != 'undefined') {
			mc = this._$dom[e.tName][e.round]['mc'];
			if (mc[e.match]) {
				mc[e.match].$.addClass('rz_focus').bind('mouseout', function(){
					$(this).removeClass('rz_focus').unbind('mouseout');
				}).position();
			};
		};
	};
	/////ESL
	
	rz.Views = {
		ESL: ESLView
	};
	rz.scriptLoaded('ViewProvider');
})();