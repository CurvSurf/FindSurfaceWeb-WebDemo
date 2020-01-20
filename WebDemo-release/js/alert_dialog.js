/*!
 * File: alert_dialog.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function OnOKAlertDialog() {
	var dlg = document.getElementById("ALERT_DIALOG");
	var fn_callback = dlg.fnOKCallback; 
	
	dlg.fnOKCallback = null;
	dlg.fnCancelCallback = null;
	dlg.style.display = "none";
	
	if(typeof fn_callback == "function") { fn_callback(); }
}

function OnCancelAlertDialog() {
	var dlg = document.getElementById("ALERT_DIALOG");
	var fn_callback = dlg.fnCancelCallback; 
	
	dlg.fnOKCallback = null;
	dlg.fnCancelCallback = null;
	dlg.style.display = "none";
	
	if(typeof fn_callback == "function") { fn_callback(); }
}

function myAlert( msg, callback ) { myAlertCustom(msg, "OK", callback); }

function myAlertCustom( msg, btn_name, callback ) {
	document.getElementById("ALERT_TEXT").innerHTML = msg;
	document.getElementById("ALERT_BTN_OK").style.display = "none";
	
	var cancel_btn = document.getElementById("ALERT_BTN_CANCEL");
	cancel_btn.innerHTML = btn_name;
	
	var dlg = document.getElementById("ALERT_DIALOG");
	dlg.fnOKCallback = null;
	dlg.fnCancelCallback = (typeof callback == "function") ? callback : null;
	
	dlg.style.display = "block"; // Show Dialog
}

function myConfirm( msg, ok_callback, cancel_callback ) {
	myConfirmCustom( msg, "OK", "Cancel", ok_callback, cancel_callback );
}

function myConfirmCustom( msg, ok_name, cancel_name, ok_callback, cancel_callback ) {	
	document.getElementById("ALERT_TEXT").innerHTML = msg;
	
	var ok_btn = document.getElementById("ALERT_BTN_OK");
	ok_btn.innerText = ok_name;
	ok_btn.style.display = "inline-block";
	
	var cancel_btn = document.getElementById("ALERT_BTN_CANCEL");
	cancel_btn.innerText = cancel_name;
	cancel_btn.style.display = "inline-block";
	
	var dlg = document.getElementById("ALERT_DIALOG");
	dlg.fnOKCallback = (typeof ok_callback == "function") ? ok_callback : null;
	dlg.fnCancelCallback = (typeof cancel_callback == "function") ? cancel_callback : null;
	
	dlg.style.display = "block"; // Show Dialog
}

