

function update(){
	$("#list td[time]").each( function(){          
			var ecart = $(this).attr("time");
			$(this).attr("time", ecart-1000);
			ecart /= 1000;          
			var day = trunc(ecart/86400);
			ecart -= day*86400;
			var hours = trunc(ecart/3600);
			ecart -= hours*3600;
			var min = trunc(ecart/60);
			ecart -= min*60;
			var sec = trunc(ecart);
			var content = "";
			if (this.className=="finished"){
					if (day != 0) content += day+" "+((day == 1)?"day ":"days ");
					else if (hours != 0) content += pad(hours)+" "+((hours == 1)?"hour ":"hours ");
					else if (min != 0) content += pad(min)+" "+((min == 1)?"min ":"mins ");
					else if (sec != 0) content += pad(sec)+" "+((sec == 1)?"sec ":"secs ");
					content += " ago";
			}else{
					content = "in ";
					if (day != 0) content += day+" "+((day == 1)?"day ":"days ");
				   
					if (day != 0) content += pad(hours)+((hours == 1)?"h ":"h ");
					else if (day == 0 && hours!=0) content += hours+" "+((hours == 1)?"hour ":"hours ");
				   
					if (day==0 && hours!=0) content += pad(min)+((min == 1)?"m ":"m ");
					else if (day==0 && hours==0 && min != 0) content += min+" "+((min == 1)?"min ":"mins ");
				   
					if (day==0 && hours==0 && min!=0) content += pad(sec)+((sec == 1)?"s ":"s ");
					else if (day==0 && hours==0 && min==0) content += sec+" "+((sec == 1)?"sec ":"secs ");
			}
			$(this).html(content);
	});
	setTimeout("update()",1000);
}


// function update(){
	// $("#list td[time]").each(function(){		
		// var ecart = $(this).attr("time");
		// var ecartOrig = ecart;
		// $(this).attr("time", ecart-1);
		// var day = trunc(ecart/86400);
		// ecart -= day*86400;
		// var hours = trunc(ecart/3600);
		// ecart -= hours*3600;
		// var min = trunc(ecart/60);
		// ecart -= min*60;
		// var sec = trunc(ecart);
		// var content = "";
		// if (ecartOrig < 0){
			// if (day != 0) content += -day+" "+((-day == 1)?"day ":"days ");
			// else if (hours != 0) content += pad(-hours)+" "+((-hours == 1)?"hour ":"hours ");
			// else if (min != 0) content += pad(-min)+" "+((-min == 1)?"min ":"mins ");
			// else if (sec != 0) content += pad(-sec)+" "+((-sec == 1)?"sec ":"secs ");
			// content += " ago";
			// $(this).parent().attr("class", "finished");
		// }else{
			// content = "in ";
			// if (day != 0) content += day+" "+((day == 1)?"day ":"days ");
			
			// if (day != 0) content += pad(hours)+((hours == 1)?"h ":"h ");
			// else if (day == 0 && hours!=0) content += hours+" "+((hours == 1)?"hour ":"hours ");
			
			// if (day==0 && hours!=0) content += pad(min)+((min == 1)?"m ":"m ");
			// else if (day==0 && hours==0 && min != 0) content += min+" "+((min == 1)?"min ":"mins ");
			
			// if (day==0 && hours==0 && min!=0) content += pad(sec)+((sec == 1)?"s ":"s ");
			// else if (day==0 && hours==0 && min==0) content += sec+" "+((sec == 1)?"sec ":"secs ");
		// }
		// $(this).html(content);
	// });
	// setTimeout("update()",1000);
// }

function showSeries() {
/*	var serverTime = new Date();
	var source = req.responseText;
	var tmpS = source.indexOf("var timestamp");
	var tmpE = source.indexOf("</script>", tmpS);
	eval(source.substring(tmpS, tmpE));
	
	var database = [];
	var id, ts;
	var PP = $(source).find("#completelisting");
	var sssss = $(source).find("#completelisting").next("div");
	$(source).find("#completelisting").nextAll("div").each(function (e){
		id = $(this).find("td.c4 div").attr("id");
		for (var a = 0; a < episode.length; a++) {
			if (episode[a] == id) {
				ts = new Date(timestamp[a]);
			}
		}	
		database.push([$(this).find("td.c1").text(), $(this).find("td.c2").text(), $(this).find("td.c3").text(), id, ts]);	
	});	
	*/
	
	icalParser.parseIcal(req.responseText);
       
	icalParser.ical.events.sort(function (a, b){
			var time1 = a.dtstart.value;
			var time2 = b.dtstart.value;
			return time1>time2 ? 1 : time1<time2 ? -1 : 0;
	});
   
	$("#noserie").remove();
	var maxN = options.next;
	var maxP = options.previous;
	for(var i=icalParser.ical.events.length-1; i>=0; i--){
			var here = new Date();
			here.setHours(here.getHours()+(here.getTimezoneOffset()/60)-4);
			var away = convertDate(icalParser.ical.events[i].dtstart.value);
			var id = getID(icalParser.ical.events[i].uid.value);
			if ((here >= away) && (inArrayMax(showedPrevious, id, maxP))){
					var title = icalParser.ical.events[i].summary.value;
					var title = title.substring(0, title.indexOf(" - S")+9).replace(/ - /gi, ' ');
					var item =  "<tr class=\"finished\"><td><img id=\""+id+"\" src=\"images/series/"+id+".png\" style=\"width:44px; height:25px\"></img></td><td style=\"width:0.75ex\">&nbsp;</td>";
					item += "<td style=\"width:329px;\" class=\"linkP\" id=\""+title+"\">"+filterText(icalParser.ical.events[i].summary.value)+"</td>";
					item += "<td class=\"finished\" style=\"width:175px; text-align:center; "+(((here-away)<=86400000)?"font-weight:bold;":"")+"\" time=\""+(here-away)+"\"></td></tr>";
					$("#list").prepend(item);
					showedPrevious.push(id);
			}
	}
	var todayShow = 0;
	for(var i=icalParser.ical.events.length-1; i>=0; i--){
			var here = new Date();
			here.setHours(here.getHours()+(here.getTimezoneOffset()/60)-4);
			var away = convertDate(icalParser.ical.events[i].dtstart.value);
			if (away > here){
					if ((away-here)<=86400000) todayShow++;
			}
	}       
	for(var i=0; i<icalParser.ical.events.length; i++){
			var here = new Date();
			here.setHours(here.getHours()+(here.getTimezoneOffset()/60)-4);
			var away = convertDate(icalParser.ical.events[i].dtstart.value);
			var id = getID(icalParser.ical.events[i].uid.value);
			if ((away > here) && (inArrayMax(showedNext, id, maxN))){
					var title = icalParser.ical.events[i].summary.value;
					var title = title.substring(0, title.indexOf(" - S")).split(" ").join("+") + '+Official+website';
					var item =  "<tr><td><img id=\""+id+"\" src=\"images/series/"+id+".png\" style=\"width:44px; height:25px\"></img></td><td style=\"width:0.75ex\">&nbsp;</td>";
					item += "<td style=\"width:329px;\" class=\"linkN\" id=\""+title+"\">"+filterText(icalParser.ical.events[i].summary.value)+"</td>";
					item += "<td style=\"width:175px; text-align:center; "+(((away-here)<=86400000)?"font-weight:bold;":"")+"\" time=\""+(away-here)+"\"></td></tr>";
					$("#list").append(item);
					showedNext.push(id);
			}              
	}      
	
	/*if (database.length > 0) $("#noserie").remove();*/
		
	/*var here = new Date();
	here.setHours(here.getHours()+(here.getTimezoneOffset()/60)-5);
	for(var i=database.length-1; i>=0; i--){
		var away = database[i][4];
		var id = database[i][3].substring(0, database[i][3].indexOf("_"));
		if (away <= here){
			if (inArrayMax(showedPrevious, id, options.previous)){
				var title = database[i][0];			
				var item =  "<tr class=\"finished\"><td><img src=\"images/series/"+id.substr(1)+".png\"></img></td><td style=\"width:0.75ex\">&nbsp;</td>";
				item += "<td style=\"width:329px;\" class=\"linkP\">"+database[i][0] + " - " + database[i][1] + " - " + database[i][2] +"</td>";
				item += "<td style=\"width:175px; text-align:center; "+(((here-away)<=86400000)?"font-weight:bold;":"")+"\" time=\""+trunc((away-here)/1000)+"\"></td></tr>";
				$("#list").prepend(item);
				showedPrevious.push(id);
			}
		}
	}
	var todayShow = 0;
	for(var i=0; i<database.length; i++){
		var away = database[i][4];
		var id = database[i][3].substring(0, database[i][3].indexOf("_"));
		if (away > here){
			if ((away-here)<=86400000) todayShow++;
			if (inArrayMax(showedNext, id, options.next)){
				var title = database[i][0];			
				var item =  "<tr><td><img id=\""+id+"\" src=\"images/series/"+id.substr(1)+".png\"></img></td><td style=\"width:0.75ex\">&nbsp;</td>";
				item += "<td style=\"width:329px;\" class=\"linkN\">"+database[i][0] + " - " + database[i][1] + " - " + database[i][2] +"</td>";
				item += "<td style=\"width:175px; text-align:center; "+(((away-here)<=86400000)?"font-weight:bold;":"")+"\" time=\""+trunc((away-here)/1000)+"\"></td></tr>";
				$("#list").append(item);
				showedNext.push(id);
			}
		}		
	}*/
	
	chrome.runtime.getBackgroundPage(function(backgroundPage) {	
		backgroundPage["updateBadge"](todayShow);
	});
	
	$(".linkN").mouseenter(function(){
		$(this).stop(true, false);
		$(this).animate({color:'#E17009'}, "fast");
	});
	$(".linkP").mouseenter(function(){
		$(this).stop(true, false);
		$(this).animate({color:'#1E5EFF'}, "fast");
	});
	$("td[class^='link']").mouseleave(function(){
		$(this).animate({color:'#000000'}, "fast");
	});
	update();
}

var req;
var showedNext = new Array();
var showedPrevious = new Array();
var todayShow = 0;
var options;
chrome.runtime.getBackgroundPage(function(backgroundPage) {
	options = backgroundPage['options'];
	if (options.series.length){
		var param = "c" + options.series[0] + "=1";
		for (var i=1; i<options.series.length; i++) param += "&c"+options.series[i]+"=1";
		param += "&format=ical";
		console.log("Param : " + param);	
		req = new XMLHttpRequest();
		req.open("GET", "https://tvcountdown.com/?"+param, true);
		req.onload = showSeries;
		req.send(null);
	}else{
		$('#noserietxt').text('See Options, and choose your favorite series !');
		console.log("No series");
	}
});	