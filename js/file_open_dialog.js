/*!
 * File: file_open_dialog.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function OpenFileOpenDialog() {
	document.getElementById('FILE_OPEN_DIALOG').style.display = "block";
}

function CloseFileOpenDialog() {
	document.getElementById('LOCAL_FILE_INPUT_FORM').reset();
	SetFileDescriptionVisible('');
	
	document.getElementById('FILE_OPEN_DIALOG').style.display = "none";
}

function SetFileInputVisible(bShow) {
	document.getElementById('LOCAL_FILE_INPUT').style.display = bShow ? "block" : "none";
}

function SetFileDescriptionVisible(select_value) {
	var divList = document.querySelectorAll("#FILE_DESC_AREA > div");
	for(var i = 0; i < divList.length; i++) {
		divList[i].style.display = (divList[i].getAttribute('name') == select_value) ? "block" : "none";
	}
}

function _getFileObject(id) {
	var file_input = document.getElementById('LOCAL_FILE_INPUT').files;
	if(file_input.length < 1) { myAlert(ERR_MSG_FILE_SELECT); return false; }
	return file_input[0];
}

function _initApplication(points, which) {
	if(gApp != null ) { if( gApp instanceof WebGLApp ) { gApp.Stop(); } gApp = null; }
	
	if( _getCursorMode() != 'normal' ) onClickCursorType('normal');
	CancelFindSurface(); // menu.js
	ClearInfoList();
	_resetVisibleButtonGroup();
	
	try { gApp = new WebGLApp( document.getElementById('GL_CANVAS'), points, document.getElementById('TEXT_CANVAS') ); }
	catch(e) { myAlert(ERR_MSG_WEBGL_FAILED); gApp = null; return; }
	
	_LoadParamPreset(which);
	
	if(gApp.WebGLContext == null) { myAlert(ERR_MSG_WEBGL_SUPPORT); return; }
	gApp.Init();
	gApp.Run();
	
	UpdateOutliersInfo( gApp.pointcloud.count );
}

function _pointsValidation(points, which) {
	var MAX_POINT_CNT = 500000;
	
	if(!Array.isArray(points) || points.length % 3 != 0 || points.length < 3) {
		myAlert(ERR_MSG_INVALID_POINT_DATA); return false;
	}
	
	if( MAX_POINT_CNT / (points.length / 3) < 0.9 ) {
		if( myConfirm(ERR_MSG_CONFIRM_DOWNSAMPLING, function() { _initApplication( SamplePoints(points, MAX_POINT_CNT), which ); }));
		return false;
	}
	
	return points;
}

function onLoadPointsComplete(points, which) {
	points = _pointsValidation(points, which);
	if(points === false) return;
	_initApplication(points, which);
}

function ApplyFileOpen() {
	var sel = document.getElementById('FILE_OPEN_WHICH').value;
	if(sel == '') { myAlert(ERR_MSG_PC_SELECT); return; }
	
	var file = (sel == 'M') ? _getFileObject('LOCAL_FILE_INPUT') : null;
	if(file === false) return;
	CloseFileOpenDialog();
	
	if(sel == 'M') { LoadPointCloudFromFile(file, onLoadPointsComplete); }
	else { LoadPointCloudFromServerJSON( sel, onLoadPointsComplete); }
}

function CancelFileOpenDialog() {
	CloseFileOpenDialog();
}