(function(){
	var rzContainer = null;
	var roundsC = {};
	var w = $(window);

	function go(){
		var tree = $('table')[0];
		rzContainer = $(tree.parentNode);
		tree = $(tree);
		
		var tr = $('tr', tree);
		var head = $('.TextS', tr[0]);
		tree.hide();
		
		var rzHead = createL('rz_head');
		rzHead.addClass('rz_head');
		rzContainer.prepend(rzHead);
		
		var $note = $('<div class="rz_note">Вышла новая версия ESL Magic. Посетите <a href="http://esl.redzerg.ru/">esl.redzerg.ru</a> для обновления.</a>'
						+ '<br>Подробности обновления читать на: <a href="http://vodportal.ru/tag/ESL%20Magic/">vodportal.ru</a></div>');
		$note.insertBefore(rzContainer);
		
		for(var t in head) {
			if (typeof(head[t]) == 'object' && head[t].nodeName && head[t].nodeName == 'TD') {
				var d = $('div', head[t]).addClass('rz_headBotton');
				var name = d.html().replace(/\n?\s?/g, '');
				var r = createL('rz_' + name);
				r.html('<h3>'+name+'</h3>');
				roundsC[name] = r;
				r.hide();
				r.addClass('rz_rounds');
				r.insertAfter(rzHead);
				
				//remove old event
				d.unbind();				
				d.bind('click', name, function(e) {
					hideAll();
					roundsC[e.data].show();
				});				
				
				rzHead.append(d);
			};
		};
		rzHead.show();
		trParse(tr);
		
		tree.innerHtml = '';
		if(1){};
	};
	
	function createL(id){
		var c = document.createElement('div');
		if (id) c.id = id;
		return $(c);
	};
	
	function hideAll() {
		for (var r in roundsC) {
			roundsC[r].hide();
		};
	};
	
	function trParse(trs) {
		var rounds = {};
		var vs = {};
		
		for (var i = 1; i < trs.length; i++) {
			var tds = $('td', trs[i]); 
			var cols = $(tds[0]).attr('colspan');
			cols = (cols && cols != 1)? (cols / 2) - 1: 0;
			
			for (var j = 0; j < tds.length; j++) {
				var td = $(tds[j]);
				var pos = (j + 1 + cols);				
				
				if (td[0] && td[0].childNodes[0] && td[0].childNodes[0].nodeName && td[0].childNodes[0].nodeName == 'DIV') {
					var div = $(td[0].childNodes[0]).addClass(td[0].className);
					
					if (!rounds[pos]) {
						rounds[pos] = [];
					}
					
					rounds[pos].push(div);
				} else if (td[0] && td[0].childNodes[1] && td[0].childNodes[1].nodeName && td[0].childNodes[1].nodeName == 'A') {
					var v = $(td[0].childNodes[1]);
					
					if (!vs[pos]) {
						vs[pos] = [];
					}
					
					vs[pos].push(v); 
				};
			};
		};
		
		for(var r in rounds) {
			var ra = rounds[r];
			var vss = vs[r];
			var cls = createL();
			
			cls.addClass('rz_cls');
			if (ra.length == 1) {
				var c = createL('pb-'+r+'-0');
				var p = $(ra[0]).addClass('rz_player');
				$("<div id='p-" + r + "-0'></div>").bind('click', prevClick).addClass('rz_prev').appendTo(p);
				c.addClass('rz_playerBox');
				c.append(p);
				roundsC['Winner'].append(c);
				roundsC['Winner'].append(cls);
			} else {
				for (var i = 0, v = 0; i < ra.length; i += 2, v++) {
					var c = createL('pb-'+r+'-'+v);
					var p1 = $(ra[i]).addClass('rz_player');
					var p2 = $(ra[i+1]).addClass('rz_player');
					
					if (r > 1) {
						$("<div id='p-" + r + "-" + i + "'>&lArr;</div>").bind('click', prevClick).addClass('rz_prev').prependTo(p1);
						$("<div id='p-" + r + "-" + (i + 1) + "'>&lArr;</div>").bind('click', prevClick).addClass('rz_prev').prependTo(p2);
					}
					var vv = $('<div></div>').addClass('rz_vs').append(vss[v]);
					c.addClass('rz_playerBox');
					c.append(vv);
					c.append(p1);
					c.append(p2);
					
					if (ra.length > 2) {
						$("<div id='p-" + r + "-" + i + "'>&rArr;</div>").bind('click', nextClick).addClass('rz_next').appendTo(c);
					}
					
					roundsC['Round' + r].append(c);
				};
				roundsC['Round' + r].append(cls);
			};
		};		
	};
	
	function nextClick() {
		var rp = this.id.match(/\d+/g)
		var round = parseInt(rp[0]);
		var player = parseInt((rp[1]) / 4);
		
		hideAll();
		roundsC['Round'+(round+1)].show();
		var pos = $('#pb-'+(round+1)+'-'+player, roundsC['Round'+(round+1)]).addClass('rz_focus').bind('mouseout', function(){$(this).removeClass('rz_focus').unbind('mousemout');}).position();
                w.scrollTop(pos.top - (w.height() / 2));
		if(1){};
	};
	
	function prevClick() {
		var rp = this.id.match(/\d+/g)
		var round = parseInt(rp[0]);
		var player = parseInt(rp[1]);
		
		hideAll();
		roundsC['Round'+(round-1)].show();
		var pos = $('#pb-'+(round-1)+'-'+player, roundsC['Round'+(round-1)]).addClass('rz_focus').bind('mouseout', function(){$(this).removeClass('rz_focus').unbind('mousemout');}).position();
		w.scrollTop(pos.top - (w.height() / 2));
		if(1){};
	};
	
	function setStyle() {
		var style = "<style>"
			+ " .rz_note {width:100%;height:40px;border:dashed 2px red;text-align: center;padding-top: 25px;margin-bottom: 20px;}"
			+ " .rz_head {width:100%;}"
			+ " .rz_cls {clear:both;}"
			+ " .rz_player {height: 16px; display: block;}"
			+ " .rz_playerBox {width:144px; display:inline-block; float:left; position:relative; margin:2px; border:1px solid black; background:#f5f4f3; text-align:left;}"
			+ " .rz_headBotton {width:66px; display:inline-block; position:;relative; background:#e3e0dd; cursor:pointer; border:1px solid #cccccc;}"
			+ " .rz_headBotton:hover {background:#cccccc;}"
			+ " .rz_rounds {width:100%; background:#e3e0dd;}"
			+ " .rz_vs {display:inline-block;float:left;padding-top:8px;text-align:center;width:16px;}"
			+ " .rz_prev {color:#000000;display:inline-block;cursor:pointer;font-weight:bolder;}"
			+ " .rz_next {color:#000000;display:inline-block;cursor:pointer;margin-top:-25px;position:absolute;margin-left:126px;}"
			+ " .rz_focus {margin:0px;border:3px solid #99cc99;background:#aaccaa;}"
		    +"</style>";
 		$(style).appendTo('body');
	};
	
	$(document).ready(function(){
//		alert('GO!');
		setStyle();
		go();
	});
})();
