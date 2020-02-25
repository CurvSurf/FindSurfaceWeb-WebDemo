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

var G_DLG_LIST = [];
function _CheckDlgOpen() {
	var dlgCheck = { isOpen: false, openedDialogs: [] };
	G_DLG_LIST.forEach(function(dialog) { 
		var isOpen = dialog.style.display != "none";
		this.isOpen |= isOpen;
		if (isOpen) this.openedDialogs.push(dialog);
	}, dlgCheck);
	return dlgCheck;
}
window.onload = function() {
	if(!_BrowserCheck()) {
		_DisableAllMenus();
		myAlert(ERR_MSG_WEBGL_SUPPORT);
		return;
	}

	// InitDialogState -> Hide
	G_DLG_LIST = document.querySelectorAll('div.modal_dialog');
	G_DLG_LIST.forEach(function(e){ e.style.display = "none"; });
	
	_UpdateCanvasSize();
	window.addEventListener('resize', function(){
		var canvas = _UpdateCanvasSize();
		if(gApp != null && gApp instanceof WebGLApp) { gApp.Resize(canvas.clientWidth, canvas.clientHeight); }
	});

	window.addEventListener('keydown', function(e) {
		if(gApp != null && gApp instanceof WebGLApp) {
			if (_CheckDlgOpen().isOpen) return;
			switch (e.keyCode) {
				case 37/*left*/:
				case 38/*up*/:
				case 39/*right*/:
				case 40/*down*/: gApp.onArrowKeyDown(e); break;
			}
		}
	});

	window.addEventListener('keyup', function(e) {
		var result = null;
		if ((result = _CheckDlgOpen()).isOpen) {
			if (e.keyCode == 27/*ESC*/) {
				switch (result.openedDialogs[0].id) {
					case "FILE_OPEN_DIALOG": CloseFileOpenDialog(); break;
					case "FS_PARAM_DIALOG": CloseFSParamDialog(); break;
					case "COLOR_PICKER_DIALOG": CloseColorPickerDialog(); break;
					case "HELP_DIALOG": CloseHelpDialog(); break;
					case "ALERT_DIALOG": OnCancelAlertDialog(); break;
				}
			}
			return;
		}
	
		if(gApp != null && gApp instanceof WebGLApp) {
			switch (e.keyCode) {
				case 68/*d*/: this.document.querySelector("button[name='DEPTH_BTN']").click(); break;
				case 37/*left*/:
				case 38/*up*/:
				case 39/*right*/:
				case 40/*down*/: gApp.onArrowKeyUp(e); break;
			}
		}
	});

	OpenHelpDialog();
}
