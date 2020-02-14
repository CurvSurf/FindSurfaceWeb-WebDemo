/*!
 * File: param_dialog.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

var P_REAL_REGEXP = /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
function _LevelCheck(level) { return !(level < 0 || level > 10); }
function _ProbeRadiusCheck(radius) { return 0 < radius && radius <= 10; }

function _LoadParamPreset(which) {
	switch(which)
	{
		case "S1":
			gFSParam.accuracy = 0.003;
			gFSParam.meanDist = 0.05;
			gFSParam.touchR   = 0.08;
			gFSParam.probeR   = 4;
			gFSParam.radExp   = 5;
			gFSParam.latExt   = 10;
			break;
		case "S2":
			gFSParam.accuracy = 0.003;
			gFSParam.meanDist = 0.01;
			gFSParam.touchR   = 0.2;
			gFSParam.probeR   = 4;
			gFSParam.radExp   = 5;
			gFSParam.latExt   = 5;
			break;
		case "S3":
			gFSParam.accuracy = 0.04;
			gFSParam.meanDist = 0.05;
			gFSParam.touchR   = 0.4;
			gFSParam.probeR   = 4;
			gFSParam.radExp   = 5;
			gFSParam.latExt   = 5;
			break;
		default:
			gFSParam.accuracy = 0.005;
			gFSParam.meanDist = 0.01;
			gFSParam.touchR   = 0.05;
			gFSParam.probeR   = 4;
			gFSParam.radExp   = 5;
			gFSParam.latExt   = 5;
			break;
	}
}

function _ValidateParamInput() {

	if( document.getElementById('FS_PARAM_ACC').value === '' ) {
		myAlert("[Accuracy]\nPlease input a positive real number");
		return false;
	} 

	if( document.getElementById('FS_PARAM_MD').value === '' ) {
		myAlert("[Mean Distance]\nPlease input a positive real number");
		return false;
	}

	if( document.getElementById('FS_PARAM_TR').value === '' ) {
		myAlert("[Touch Radius]\nPlease input a positive real number");
		return false;
	}

	if( !_ProbeRadiusCheck( Number( document.getElementById("FS_PARAM_PR").value ) ) ) {
		myAlert("[Probe Radius]\nPlease set a value between 1 to 10");
		return false;
	}
	
	if( !_LevelCheck( Number( document.getElementById('FS_PARAM_RE').value ) ) ) {
		myAlert("[Radial Expansion]\nPlease select level 0 to 10");
		return false;
	}
	
	if( !_LevelCheck( Number( document.getElementById('FS_PARAM_LE').value ) ) ) {
		myAlert("[Lateral Extension]\nPlease select level 0 to 10");
		return false;
	}
	
	return true;
}

function _UpdateFormData(bSave) {
	if(bSave) { // Form to Variable
		gFSParam.accuracy = Number( document.getElementById('FS_PARAM_ACC').value ); 
		gFSParam.meanDist = Number( document.getElementById('FS_PARAM_MD').value );
		gFSParam.touchR = Number( document.getElementById('FS_PARAM_TR').value );
		gFSParam.probeR = Number(document.getElementById("FS_PARAM_PR").value);
		gFSParam.radExp = Number( document.getElementById('FS_PARAM_RE').value );
		gFSParam.latExt = Number( document.getElementById('FS_PARAM_LE').value );
	}
	else { // Variable to Form (Default)
		document.getElementById('FS_PARAM_ACC').value = gFSParam.accuracy; 
		document.getElementById('FS_PARAM_MD').value = gFSParam.meanDist;
		document.getElementById('FS_PARAM_TR').value = gFSParam.touchR;
		document.getElementById("FS_PARAM_PR").value = gFSParam.probeR;
		document.getElementById("FS_PARAM_PR_OUTPUT").value = gFSParam.probeR; // TODO: integrate this with input range.
		document.getElementById('FS_PARAM_RE').value = gFSParam.radExp;
		document.getElementById('FS_PARAM_LE').value = gFSParam.latExt;
	}
}

function FSPD_CheckPositiveRealNumber(input_obj) {
	if(input_obj instanceof Element && input_obj.tagName.toLowerCase() == 'input') {
		if( !P_REAL_REGEXP.test(input_obj.value) || Number(input_obj.value) === 0 ) { input_obj.className = 'invalid'; } 
		else { input_obj.className = 'valid'; }
	}
}

function FSPD_InvalidateIfCheckFailed(input_obj) {
	if(input_obj instanceof Element && input_obj.tagName.toLowerCase() == 'input') {
		if( input_obj.className === "invalid" ) { input_obj.value = ''; }
		else { input_obj.value = Number(input_obj.value); }
	}
}

function OpenFSParamWindow()
{
	document.getElementById('FS_PARAM_DIALOG').style.display = "block";
	_UpdateFormData();
}

function ApplyFSParam()
{
	if(_ValidateParamInput()) {
		_UpdateFormData(true);
		if (gApp !== null) {
			gApp.SetTouchRadius(gFSParam.touchR);
			gApp.SetProbeRadius(gFSParam.probeR);
		}
		CloseFSParamDialog();
	}
}

function CloseFSParamDialog()
{
	document.getElementById('FS_PARAM_DIALOG').style.display = "none";
}