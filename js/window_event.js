/*!
 * File: window_event.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function _UpdateCanvasSize() {
	var canvas = document.getElementById('GL_CANVAS');
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	var txt_canvas = document.getElementById('TEXT_CANVAS');
	txt_canvas.width = txt_canvas.clientWidth;
	txt_canvas.height = txt_canvas.clientHeight;
	
	return canvas;
}

function _DisableAllMenus() {
	var topPanel = document.getElementById("TOP_PANEL_AREA");
	topPanel.innerHTML = "<h3 style=\"margin: 10px;\">" + ERR_MSG_WEBGL_SUPPORT + "</h3>";
}

function _BrowserCheck() {
	if(navigator.userAgent.indexOf("MSIE") >= 0) return false; // IE < 11
	
	var
    aKeys = ["Trident", "Firefox", "Safari", "Chrome", "Chromium", "Edge", "Opera", "OPR"],
    sUsrAg = navigator.userAgent, nIdx = aKeys.length - 1;
	
	for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);
	var browser = sUsrAg.substr( sUsrAg.indexOf(aKeys[nIdx]) ).split(/\s+/)[0].split('/');
	
	var major_version = browser.length < 2 ? Number.NaN : parseFloat( browser[1] );
	if(major_version.toString() == "NaN") return false;
	
	switch(browser[0]) {
		case "OPR": case "Opera":
			if(major_version < 12) return false;
			break;
		case "Chromium": case "Chrome":
			if(major_version < 9) return false;
			break;
		case "Safari":
			if(major_version < 5.1) return false;
			break;
		case "Firefox":
			if(major_version < 4) return false;
			break;
		case "Edge":
		case "Trident": // IE 11
			break;
		
		default: return false;
	}
	
	return true;
}

window.onload = function() {
	if(!_BrowserCheck()) {
		_DisableAllMenus();
		myAlert(ERR_MSG_WEBGL_SUPPORT);
		return;
	}
	
	_UpdateCanvasSize();
	window.addEventListener('resize', function(){
		var canvas = _UpdateCanvasSize();
		if(gApp != null && gApp instanceof WebGLApp) { gApp.Resize(canvas.clientWidth, canvas.clientHeight); }
	});

	OpenHelpDialog();
}
