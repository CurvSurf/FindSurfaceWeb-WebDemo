/*!
 * File: menu.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function onClickCursorType(type) {
	if(typeof type != "string") return;
	var canvas = document.getElementById('GL_CANVAS');
	
	if( typeof canvas.userData == "string" && canvas.userData.length > 0 ) { CancelFindSurface(); }
	
	var btnName = '';
	switch(type.trim().toLowerCase()) {
		case 'move': btnName = 'move';
			canvas.style.cursor = 'url(img/move.cur), url(img/cursor_move.png), auto';
			if(gApp != null && gApp instanceof WebGLApp) { gApp.SetTrackballPan(); }
			break;
		case 'zoom': btnName = 'zoom';
			canvas.style.cursor = 'url(img/zoom.cur), url(img/cursor_zoom.png), auto';
			if(gApp != null && gApp instanceof WebGLApp) { gApp.SetTrackballZoom(); }
			break;
		case 'rotate': btnName = 'rotate';
			canvas.style.cursor = 'url(img/rotate.cur), url(img/cursor_rotate.png), auto';
			if(gApp != null && gApp instanceof WebGLApp) { gApp.SetTrackballRotate(); }
			break;
		default: btnName = 'normal';
			canvas.style.cursor = '';
			if(gApp != null && gApp instanceof WebGLApp) { gApp.SetTrackballStop(); }
			break;
	}
	
	var btnGrp = document.getElementById('CURSOR_BTN_GROUP').getElementsByTagName('button');
	for(var i = 0; i < btnGrp.length; i++) {
		btnGrp[i].className = ( btnGrp[i].name == btnName ) ? 'active' : '';
	}
}

function _getCursorMode() {
	var node = document.querySelectorAll('#CURSOR_BTN_GROUP button.active');
	return (node && node.length > 0) ? node[0].name : '';
}

function _selectTypeButton(typeName) {
	var node = document.querySelectorAll('#STYPE_BTN_GROUP button');
	var _name = typeName.toLowerCase();
	var ret = false;
	for(var i = 0; i < node.length; i++) {
		if( node[i].name.toLowerCase() == _name ) { node[i].classList.add('active'); ret = true; }
		else { node[i].classList.remove('active'); }
	}
	return ret;
}

function _deselectTypeButton() {
	var node = document.querySelectorAll('#STYPE_BTN_GROUP button.active');
	for(var i = 0; i < node.length; i++) node[i].classList.remove('active');
}

function _resetCanvasSetting(canvas) {
	canvas.userData = '';
	canvas.style.cursor = '';
	canvas.removeEventListener('click', onClickCanvas);
	canvas.removeEventListener('contextmenu', onCancelCanvas);
}

function CancelFindSurface() { _deselectTypeButton(); _resetCanvasSetting(document.getElementById('GL_CANVAS')); }

function _callFindSurface(x_normal, y_normal, typeName) {
	OpenProgressDialog('');
	setTimeout(function(){
		var idx = gApp.PickPoint(x_normal, y_normal);
		if(idx < 0) { myAlert(ERR_MSG_NO_PICKING_POINT); CloseProgressDialog();  return; }
		
		gApp.ShowTouchArea(true, gFSParam.touchR);
		
		var reqData = MakeRequestBody( gFSParam.accuracy, gFSParam.meanDist, gFSParam.touchR, idx, gFSParam.radExp, gFSParam.latExt, gApp.GetOutliers() );
		RequestFindSurface( typeName, reqData );
	});
}

function onClickCanvas(evt) {
	var typeName = typeof this.userData == "string" ? this.userData : '';
	
	_resetCanvasSetting(this);
	_deselectTypeButton();
	
	if(evt.button == 0) { // Left Mouse Clicked!!
		switch(typeName) {
			case 'auto': case 'plane': case 'sphere': case 'cylinder': case 'cone': case 'torus': break;
			default: return;
		}
		this.userData = '';
		
		if(typeof gApp != 'object' || gApp == null || !(gApp instanceof WebGLApp)) { return; }
		
		var x_normal = 2.0 * (evt.offsetX / this.clientWidth) - 1.0;
		var y_normal = -(2.0 * (evt.offsetY / this.clientHeight) - 1.0);
		
		_callFindSurface(x_normal, y_normal, typeName);
	}
}

function onCancelCanvas() { _deselectTypeButton(); _resetCanvasSetting(this); }

function onClickSurfaceType(type) {
	if(gApp === null || !(gApp instanceof WebGLApp)) { myAlert(ERR_MSG_OPEN_POINT_FIRST); return; }
	if( _getCursorMode() != 'normal' ) onClickCursorType('normal');
	if( _selectTypeButton(type) ) {
		var canvas = document.getElementById('GL_CANVAS');
		canvas.userData = type;
		canvas.style.cursor = 'crosshair';
		canvas.addEventListener('click', onClickCanvas);
		canvas.addEventListener('contextmenu', onCancelCanvas);
	}
}

function onResetView(type) {
	if(typeof type != "string") return;
	if(gApp == null || !(gApp instanceof WebGLApp)) return;
	switch(type.trim().toLowerCase()) {
		case 'front': gApp.SetCameraFront(); break;
		case 'top': gApp.SetCameraTop(); break;
		case 'side': gApp.SetCameraSide(); break;
	}
}

function onResetScene() {
	if(gApp != null && gApp instanceof WebGLApp) { gApp.Reset(); }
	CancelFindSurface();
	onClickCursorType('normal');
	ClearInfoList();
	_resetVisibleButtonGroup();
	
	UpdateOutliersInfo( gApp.pointcloud.count );
}

function _resetVisibleButtonGroup() {
	var btnList = document.querySelectorAll('#VISIBLE_BTN_GROUP button');
	for(var i = 0; i < btnList.length; i++){
		btnList[i].classList.remove('toggle_off');
		
		var imgObj = btnList[i].querySelector('img');
		if(imgObj)imgObj.src = 'img/ic_show.png';
	}
}

function _getVisibleMesh() {
	var btn = document.querySelector('#VISIBLE_BTN_GROUP button[name=MESH_BTN]');
	if(btn) { return !btn.classList.contains('toggle_off'); }
	return true;
}

function _getVisibleInliers() {
	var btn = document.querySelector('#VISIBLE_BTN_GROUP button[name=INLIER_BTN]');
	if(btn) { return !btn.classList.contains('toggle_off'); }
	return true;
}

function onClickToggleViewBtn(btnObj, which) 
{
	if(btnObj instanceof HTMLButtonElement) {
		btnObj.classList.toggle('toggle_off');
		
		var isHide = btnObj.classList.contains('toggle_off');
		var imgObj = btnObj.querySelector('img');
		
		imgObj.src = isHide ? 'img/ic_hide.png' : 'img/ic_show.png';
		
		if(which == 'mesh') {
			SetVisibleMesh(!isHide);
		}
		else if(which == 'inliers') { 
			SetVisibleInliers(!isHide); 
		}
	}
}
