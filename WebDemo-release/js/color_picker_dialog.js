/*!
 * File: color_picker_dialog.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function _IsColorHexStr(str) { return (typeof str == "string") && /^#(([0-9a-fA-F]{3})|([0-9a-fA-F]{6}))$/.test(str); }

function OpenColorPickerDialog(param1, param2) {
	var dlg = document.getElementById("COLOR_PICKER_DIALOG");
	var initColor = '#FFFFFF';
	var fnUpdateColor = null;
	
	if(typeof param1 == "function") { fnUpdateColor = param1; }
	else {
		if(_IsColorHexStr(param1)) { initColor = param1; }
		if(typeof param2 == "function") { fnUpdateColor = param2; }
	}
	dlg.fnUpdateColor = fnUpdateColor;
	cpdlg_clickColor(initColor);
	
	dlg.style.display = "block";
}

function ApplyColorPickerDialog() {
	var dlg = document.getElementById("COLOR_PICKER_DIALOG");
	var color_hex = document.getElementById('CPDLG_PREVIEW_COLOR').currColor;
	
	if(typeof dlg.fnUpdateColor == "function") {
		dlg.fnUpdateColor(color_hex);
	}
	dlg.style.display = "none";
}

function CloseColorPickerDialog() {
	document.getElementById("COLOR_PICKER_DIALOG").style.display = "none";
}

function cpdlg_clickColor(color_hex, top, left) {
	if(!_IsColorHexStr(color_hex)) return false;
	
	if( (!left || left == -1) || (!top || top == -1) ) {
		var hex = color_hex.toUpperCase();
		var nodeList = document.querySelectorAll('#COLOR_MAP > area');
		for(var i = 0; i < nodeList.length; i++) {
			if( nodeList[i].getAttribute("alt") == hex ) {
				var _tmp = nodeList[i].getAttribute("onclick").replace(')', '').split(',');
				top = Number(_tmp[1]);
				left= Number(_tmp[2]);
				break;
			} 
		}
	}
	
	var sel_icon = document.getElementById('CPDLG_SELECTED_HEXAGON'); 
	if( (top + 200) > -1 && left > -1 ) {
		sel_icon.style.top = (top-3) + "px";
		sel_icon.style.left = (left-1) + "px";
		sel_icon.style.visibility = "visible";
	}
	else {
		sel_icon.style.visibility = "hidden";
	}
	
	document.getElementById('CPDLG_PREVIEW_COLOR').currColor = color_hex;
	document.getElementById('CPDLG_PREVIEW_COLOR').style.backgroundColor = color_hex;
	document.getElementById('CPDLG_ENTER_COLOR').value = color_hex;
}

function cpdlg_from_input() {
	var colorStr = document.getElementById('CPDLG_ENTER_COLOR').value.trim();
	if(cpdlg_clickColor(colorStr) === false) { myAlert("Please input color value as Hex form (#FFFFFF)"); return; }
}

function cpdlg_enter_press(evt) {
	var key = evt.which || evt.keyCode;
	if(key == 13) cpdlg_from_input();
}
