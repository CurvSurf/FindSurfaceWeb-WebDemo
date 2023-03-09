/*!
 * File: point_reader.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function parseLineListAscii(lineList) {
	var ret = [];
	for(var i = 0; i < lineList.length; i++) {
		if(lineList[i].length > 0) {
			var list = lineList[i].trim().split(/\s*,?\s+/);
			if(list.length > 2) {
				var x = Number(list[0]);
				var y = Number(list[1]);
				var z = Number(list[2]);
				
				if( x.toString() != "NaN" && y.toString() != "NaN" && z.toString() != "NaN" ) {
					ret.push(x); ret.push(y); ret.push(z);
				}
			}
		}
	}
	return ret.length > 0 ? ret : null;
}

function parseLineListObj(lineList) {
	var ret = [];
	var i = 0;
	
	for( i = 0 ; i < lineList.length; i++) {
		if(lineList[i].length > 0) {
			var line = lineList[i].trim();
			if(line.charAt(0) == '#') continue; // comment line
			var list = line.split(/\s+/);
			
			if(list.length > 3 && (list[0] == 'v' || list[0] == 'V')) {
				var x = Number(list[1]);
				var y = Number(list[2]);
				var z = Number(list[3]);
				
				if( x.toString() != "NaN" && y.toString() != "NaN" && z.toString() != "NaN" ) {
					ret.push(x); ret.push(y); ret.push(z);
				}
			}
		}
	}
	return ret.length > 0 ? ret : null;
}

function LoadPointCloudFromFile(file, onLoadComplete) {
	var reader = new FileReader();
	if( !(file instanceof File) ) { myAlert(ERR_MSG_INVALID_FILE_INSTANCE); return; }
	if( file.size > (1024 * 1024 * 70) ) { alert(ERR_MSG_TOO_HUGE_FILE_SIZE); return; }
	
	var ext = file.name.substring( file.name.lastIndexOf('.') ).toLowerCase();
	if(ext == ".xyz") { // ascii .xyz file
		reader.fnParseLineList = parseLineListAscii;
	}
	else if(ext == ".obj") { // wavefront .obj file
		reader.fnParseLineList = parseLineListObj;
	}
	else { alert(ERR_MSG_INVALID_FILE_EXTENSION); return; }
	
	reader.onload = function(evt) {		
		var txt = evt.target.result;
		var lineList = txt.split(/[\r\n]+/);
		
		var ret = null;
		if( typeof evt.target.fnParseLineList == "function" ) {
			ret = evt.target.fnParseLineList(lineList); 
		}
		
		if( typeof onLoadComplete == "function" ) {
			onLoadComplete(ret);
		}
		
		CloseProgressDialog();
	}
	
	OpenProgressDialog('Please wait while reading<br/><strong>&lt;'+file.name+'&gt;</strong>');
	reader.readAsText(file);
}

function _GetPresetPath(which) {
	switch(which)
	{
		case "S1": return "preset/sample.xyz.json";
		case "S2": return "preset/LFM_2Mio_to_500K.xyz.json";
		case "S3": return "preset/ipad_gymball_100K.xyz.json";
	}
	return ""; // empty string
}

function LoadPointCloudFromServerJSON(which, onLoadComplete)
{
	var presetName = _GetPresetPath(which);
	if(presetName.length == 0) return;

	var xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		var points = null;
		if(this.status == 200) {
			try{ points = JSON.parse(this.responseText); } catch(e) { alert( ERR_MSG_INVALID_RESPONSE ); return; }
		}
		else if(this.status == 404) {
			alert()
		}
		else { alert( ERR_MSG_RESPONSE_ERROR(this.statusText + '(' + this.status + ')') ); return; }

		if(points !== null && typeof onLoadComplete == "function") { onLoadComplete(points, which); }
	}
	xhttp.onloadend = function() { CloseProgressDialog(); }

	xhttp.open("GET", presetName);

	OpenProgressDialog('Please wait while reading data from server');
	xhttp.send();
}
