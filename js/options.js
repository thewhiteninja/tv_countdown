

function restoreOptions() {
	console.log("restoreOptions ("+options.series+")");
	if (options.series.length){
		for(var serie in options.series) {
			var input = document.getElementById(options.series[serie]);
			if (input){
				input.setAttribute("checked", "1");
				$(input).parent().css("font-weight", "bold");
				$(input).parent().css("font-size", "20px");
				$(input).parent().css("color", "#3333CC");
			}else
				console.error("Serie ID : "+serie+" not found !");
		}
		$("#titleCount").text("(" + options.series.length + ")");
	}else{
		$("#titleCount").text("");
	}
}

function selection(e){
	console.log("selection ("+e.id+")");
	removeInArray(options.series, e.id);
	if (e.getAttribute("checked")!="1"){
		options.series.push(e.id);
		e.setAttribute("checked", "1");
		$(e).animate({ color: "#3333CC",  "font-size": "20px"}, 250);
		$(e).css("font-weight", "bold");
	}else{
		e.setAttribute("checked", "0");
		$(e).animate({ color: "#000000",  "font-size": "12px"}, 250);
		$(e).css("font-weight", "normal");
	}
	if (options.series.length) $("#titleCount").text("(" + options.series.length + ")");
	options.save();
	chrome.runtime.getBackgroundPage(function(backgroundPage) {	
		backgroundPage["updateBadge"]();
	});
}

function littleFilter(title){
	var i = title.indexOf("(");
	if (i != -1) return title.substring(0, i-1);
	else return title;
}

function parseList(){
	console.log("parseList");
	var tvshows = [];
	eval(req.responseText);
	for(var i=0; i<shows.length; i++){
		var serie = new Array();
		serie[0] = shows[i][0];
		serie[1] = shows[i][1]; 
		switch(serie[1]){
			case 1061:
				serie[0] = "Tabatha's Salon Takeover";
				break;
			case 1062:
				serie[0] = "Behzat C";
				break;		
			case 1990:
				serie[0] = "Tim and Eric's Bedtime Stories";
				break;				
		}
		tvshows.push(serie)
	};
	
	tvshows.sort(function (a, b){
		var title1 = a[0];
		title1 = title1.toLowerCase();
		var title2 = b[0];
		title2 = title2.toLowerCase();
		return title1>title2 ? 1 : title1<title2 ? -1 : 0; 
	});

	var alpha = "abcdefghijklmnopqrstuvwxyz";
	var lastIndex = -1;
	var offset = 0;
	var content = "";
	for(var i=0; i<tvshows.length; i++){
		if ((i>0) && ((offset%5)==0)) content = content + "</tr><tr>";
		var name = tvshows[i][1];
		var title = littleFilter(tvshows[i][0]);
		if (name != undefined){
			if (alpha.indexOf(title.toLowerCase().charAt(0)) != lastIndex) {
				lastIndex = alpha.indexOf(title.toLowerCase().charAt(0))
				content += "</tr><tr class=\"separator\" id=\""+alpha.charAt(lastIndex)+"\"><td colspan=\"10\">&nbsp;</td></tr><tr>";
				offset = 0;
			}
			content = content + "<td><label serie=\"1\" id=\""+name+"\">"+title+"</label></td>";
			offset += 1;
		}
	}
	document.getElementById("list").innerHTML = content;
	restoreOptions();
	addEvent();
	$("#loading").fadeOut("fast", 
		function(){
			$("#loading").hide();
			$("#list").fadeIn("1000");
		}
	);
}

function addEvent(){

	$("#previousvalue").text(options.previous);
	$("#previous").slider({
		value: options.previous,
		min: 0,
		max: 2,
		step: 1,
		slide: function(event, ui) {
			console.log("previous : " + ui.value);
			options.previous = ui.value;
			options.save();
			$("#previousvalue").text(ui.value);
		}
	});
	
	$("#nextvalue").text(options.next);
	$("#next").slider({
		value: options.next,
		min: 1,
		max: 3,
		step: 1,
		slide: function(event, ui) {
			console.log("next : " + ui.value);
			options.next = ui.value;
			options.save();
			$("#nextvalue").text(ui.value);
		}
	});

	$("label[serie]").click(function(e) {
	  selection(e.target);
	});

	$("#badge").button();
	$("#badge").attr('checked', options.badge);
	$("#badge").button("refresh"); 
	$("#badge").click(function(){
		options.badge = $("#badge").attr('checked');
		options.save();
		if (!options.badge){
			chrome.runtime.getBackgroundPage(function(backgroundPage) {	
				backgroundPage["hideBadge"]();
			});
		}
		chrome.runtime.getBackgroundPage(function(backgroundPage) {	
			backgroundPage["updateBadge"]();
		});
	});

	$('#colorSelector').css('backgroundColor', '#' + options.badgeColor);
	$('#colorSelector').ColorPicker({
		color: '#ff0000',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorSelector').css('backgroundColor', '#' + hex);
			chrome.runtime.getBackgroundPage(function(backgroundPage) {	
				backgroundPage["setBadgeColor"](hex);
			});
			options.badgeColor = hex;
			options.save();
		}
	});

	$("#reset").button();
	$("#reset").click(function(){
		options.series = [];
		options.save();
		chrome.runtime.getBackgroundPage(function(backgroundPage) {	
			backgroundPage["updateBadge"]();
		});
		$("#list label").each( 
			function () {
				this.setAttribute("checked", "0");
				$(this).css("font-weight", "normal");
				$(this).css("font-size", "12px");
				$(this).css("color", "#000000");
			}
		);
		restoreOptions();
	});

}

function init(){
	console.log("init");

	$("#letterlist").buttonset();
	$("#tabs").tabs();
	req.open("GET", "https://tvcountdown.com/js/shows.js", true);
	req.onload = parseList;
	req.send();
}

var req = new XMLHttpRequest();
var options;
chrome.runtime.getBackgroundPage(function(backgroundPage) {
	options = backgroundPage['options'];
});
document.addEventListener('DOMContentLoaded', init);