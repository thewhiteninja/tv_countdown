
var OPTIONS = {
	badge : true,
	badgeColor : '00c4ef',
	previous : 1,
	next : 1,
	series : [],
	date : 0,
	ready : false,
	save : function(){
		localStorage.tvcountdownopt = escape(JSON.stringify(options));
		this.ready = true;
	},
	load : function(){
		var tmp = localStorage.tvcountdownopt;
		if (tmp) OPTIONS.loadFromJSON(unescape(tmp));
		else OPTIONS.save();
	},
	loadFromJSON : function(s){
		console.log('loadFromJSON');
		var prop, savedVersion = JSON.parse(s);
		for (prop in this) {
			if ((typeof this[prop] !== 'function') &&
				(savedVersion[prop] != undefined)  &&
				(prop != 'ready')) this[prop] = savedVersion[prop];
		}	
		this.ready = true;
	},
	isReady : function(){
		return this.ready;
	}
};

function parseResult(){
	console.log("parseResult");
	var serverTime = new Date();
	var source = req.responseText;
	var tmpS = source.indexOf("timediff") + 12;
	var tmpE = source.indexOf("</script>", tmpS);
	eval(source.substring(tmpS, tmpE));
	
	var id, ts;
	var todayShow = 0;
	var here = new Date();
	here.setHours(here.getHours()+(here.getTimezoneOffset()/60)-5);
	
	$(source).find("table.episode_list_table tr[class]").each(function (e){
		id = $(this).find("td.c4 div").attr("id");
		for (var a = 0; a < episode.length; a++) {
			if (episode[a] == id) {
				ts = new Date(timestamp[a]);
				break;
			}
		}	
		if (ts > here){
			if ((ts-here) < 86400000) todayShow++;
		}
	});	

	if (todayShow) chrome.browserAction.setBadgeText({text:String(todayShow)});
	else hideBadge();
}

function updateBadge(val){
	console.log("updateBadge (" + val + ')');
	if (options.badge){
		if (isset(val)){
			if (val) chrome.browserAction.setBadgeText({text:String(val)});
			else hideBadge();
			clearTimeout(timer);
		}else{
			if (options.series.length){
				var param = options.series.join("=1&") + "=1";
				console.log("Param : " + param);
				req.open("GET", "http://tvcountdown.com/?"+param, true);
				req.onload = parseResult;
				req.send(null);
			}else{
				hideBadge();
				console.log("No series");
			}
		}
	}
	timer = setTimeout("updateBadge()",5*60000);
}

function hideBadge(){
	console.log("hideBadge");
	chrome.browserAction.setBadgeText({text:''});
}

function setBadgeColor(c){
	console.log("setBadgeColor");
	chrome.browserAction.setBadgeBackgroundColor(rvbToJSON(c));
}

function waitOptions(){
	console.log('waitOptions');
	if (options.isReady()) updateBadge();
	else window.setTimeout('waitOptions()', 500);
}

var timer;
var req = new XMLHttpRequest();
var options = OPTIONS;
options.load();
setBadgeColor(options.badgeColor);

waitOptions();
