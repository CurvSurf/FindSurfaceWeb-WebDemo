/*!
 * File: param_dialog.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

var P_REAL_REGEXP = /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
var P_INT_REGEXP = /^[0-9]+$/;
function _LevelCheck(level) { return !(level < 0 || level > 10); }

function _LoadParamPreset(which) {
	switch(which)
	{
		case "S1":
			gFSParam.accuracy = 0.003;
			gFSParam.meanDist = 0.05;
			gFSParam.touchR   = 0.05;
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
	if( !P_REAL_REGEXP.test( document.getElementById('FS_PARAM_ACC').value ) ) {
		myAlert("[Accuracy]\nPlease input positive real number");
		return false;
	} 
	if( !P_REAL_REGEXP.test( document.getElementById('FS_PARAM_MD').value ) ) {
		myAlert("[Mean Distance]\nPlease input positive real number");
		return false;
	}
	if( !P_REAL_REGEXP.test( document.getElementById('FS_PARAM_TR').value ) ) {
		myAlert("[Touch Radius]\nPlease input positive real number");
		return false;
	}
	if( !P_INT_REGEXP.test( document.getElementById("FS_PARAM_PR").value ) ) {
		myAlert("[Probe Radius]\nPlease input positive integer");
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
		
		document.getElementById('FS_PARAM_RE').value = gFSParam.radExp;
		document.getElementById('FS_PARAM_LE').value = gFSParam.latExt;
	}
}

function FSPD_CheckNumber(input_obj, test_int) {
	if(input_obj instanceof Element && input_obj.tagName.toLowerCase() == 'input') {
		if( !P_REAL_REGEXP.test(input_obj.value) || (test_int === true && !P_INT_REGEXP.test(input_obj.value) ) ) { input_obj.value = ''; } 
		else { input_obj.value = Number(input_obj.value); }
	}
}

function FSPD_ChangeCircleColor(target) {
	switch (target) {
		case "touchR": {
			var initColor = gApp != null && gApp instanceof WebGLApp ? _ColorFloat32Hex(gApp.GetTouchRadiusCircleColor()) : false;
			OpenColorPickerDialog(initColor, function(colorHex) {
				if (gApp != null && gApp instanceof WebGLApp) {
					var color_float3 = _ColorHex2Float3(colorHex);
					if (color_float3 !== false) gApp.SetTouchRadiusCircleColor( color_float3[0], color_float3[1], color_float3[2] );
				}
			});
		} break;
  
		case "probeR": {
			var initColor = gApp != null && gApp instanceof WebGLApp ? _ColorFloat32Hex(gApp.GetProbeRadiusCircleColor()) : false;
			OpenColorPickerDialog(initColor, function(colorHex) {
				if (gApp != null && gApp instanceof WebGLApp) {
					var color_float3 = _ColorHex2Float3(colorHex);
					if (color_float3 !== false) gApp.SetProbeRadiusCircleColor( color_float3[0], color_float3[1], color_float3[2] );
				}
			});
		} break;
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
		gApp.SetTouchRadius(gFSParam.touchR);
		gApp.SetProbeRadius(gFSParam.probeR);
		CloseFSParamDialog();
	}
}

function CloseFSParamDialog()
{
	document.getElementById('FS_PARAM_DIALOG').style.display = "none";
}