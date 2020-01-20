/*!
 * File: progress_dialog.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function OpenProgressDialog(title) {
	document.getElementById('PROGRESS_DIALOG_TITLE').innerHTML =
		(typeof title == "string" && title.length > 0) ? title : 'Loading...';
	
	document.getElementById('PROGRESS_DIALOG').style.display = "block";
}

function CloseProgressDialog() {
	document.getElementById('PROGRESS_DIALOG').style.display = "none";
}