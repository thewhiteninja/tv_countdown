
function isset(v){
	return ((typeof(v)!=undefined) && (v!=null) && (v!=''));
}

function removeInArray(arr, obj) {
	for(var i=0; i<arr.length; i++) {
		if (arr[i] == obj){
			arr.splice(i, 1);
			break;
		}
	}
}

function getID(s){
        return s.substring(s.indexOf("-")+1, s.indexOf("@"));
}

function filterText(e){
	var filtered = e.replace(/\[.*\]/gi, '');
	filtered = filtered.replace(/\(.*\)/gi, '');
	return filtered;
}

function convertDate(s){
	var y = s.substring(0, 4);
	var m = s.substring(4, 6);
	var d = s.substring(6, 8);
	var h = s.substring(9, 11);
	var mi = s.substring(11, 13);
	var s = s.substring(13, 15);
	return new Date(y, m-1, d, h, mi, s);
}

function rvbToJSON(s){
	var r = parseInt(s.substring(0, 2), 16);	
	var v = parseInt(s.substring(2, 4), 16);
	var b = parseInt(s.substring(4, 6), 16);
	return {color:[r, v, b, 255]};
}

function isFile(str){
    var O = new XMLHttpRequest();
    try {
        O.open("HEAD", str, false);
        O.send();
        return (O.status==200) ? true : false;
    } catch(er) {
        return false;
    }
}

function pad(str) {   
    if (str<10) return "0"+str;
	return str;
}

function convertDate(s){
	var y = s.substring(0, 4);
	var m = s.substring(4, 6);
	var d = s.substring(6, 8);
	var h = s.substring(9, 11);
	var mi = s.substring(11, 13);
	var s = s.substring(13, 15);
	return new Date(y, m-1, d, h, mi, s);
}

function trunc(_value){
  if (_value<0) return Math.ceil(_value);
  else return Math.floor(_value);
}

function inArray(arr, obj) {
  for(var i=0; i<arr.length; i++) {
    if (arr[i] == obj) return true;
  }
  return false;
}

function inArrayMax(arr, obj, max) {
  var count = 0;
  for(var i=0; i<arr.length; i++) {
    if (arr[i] == obj) count++;
  }
  return (count<max);
}
