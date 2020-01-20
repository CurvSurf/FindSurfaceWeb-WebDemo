/*!
 * File: object_panel.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function MakeVectorStr(v) { return '( ' + v[0].toFixed(4) + ', ' + v[1].toFixed(4) + ', ' + v[2].toFixed(4) + ' )'; }

function MakePlaneInfo(param) {
	return [ 'Center: ' + MakeVectorStr(param.c), 'Normal: ' + MakeVectorStr(param.n) ];
}

function MakeSphereInfo(param) {
	return [ 'Radius: ' + param.r, 'Center: ' + MakeVectorStr(param.c) ];
}

function MakeCylinderInfo(param) {
	return [ 'Radius: ' + param.r, 'Height: ' + param.h, 'Center: ' + MakeVectorStr(param.c), 'Axis: ' + MakeVectorStr(param.n) ];
}

function MakeConeInfo(param) {
	return [ 'Radius: (' + param.tr + ', ' + param.br + ' )', 'Height: ' + param.h, 'Center: ' + MakeVectorStr(param.c), 'Axis: ' + MakeVectorStr(param.n) ];
}

function MakeTorusInfo(param) {
	return [ 'Radius: (' + param.mr + ', ' + param.tr + ' )', 'Center: ' + MakeVectorStr(param.c), 'Axis: ' + MakeVectorStr(param.n) ];
}

function DomTitleButton(objID, img_src, title_str)
{
	var btn = document.createElement('button');
	var img = document.createElement('img');
	var title = document.createElement('span');
	
	img.className = 'list_img';
	img.src = img_src;
	title.innerText = title_str;
	
	btn.appendChild(img);
	btn.appendChild(title);
	
	btn.addEventListener('click', function() {
		var content = this.nextElementSibling;
		var openNew = !Boolean(content.style.maxHeight);
		
		DeselectInfoAll();
		if(openNew) {
			this.classList.add('active');
			content.style.removeProperty('display');
			content.style.maxHeight = content.scrollHeight + "px";
			if( gApp != null && gApp instanceof WebGLApp ) {
				gApp.SelectObject(objID);
			}
		}
	});
	
	return btn;
}

function _ColorHex2Float3(hex_str) {
	if( _IsColorHexStr(hex_str) ) {
		var ret = [ 0, 0, 0 ];
		if(hex_str.length == 4) { // #XXX
			ret[0] = parseInt( '0x' + hex_str.charAt(1) + hex_str.charAt(1) ) / 255;
			ret[1] = parseInt( '0x' + hex_str.charAt(2) + hex_str.charAt(2) ) / 255;
			ret[2] = parseInt( '0x' + hex_str.charAt(3) + hex_str.charAt(3) ) / 255;
		}
		else {
			ret[0] = parseInt( '0x' + hex_str.substr(1, 2) ) / 255;
			ret[1] = parseInt( '0x' + hex_str.substr(3, 2) ) / 255;
			ret[2] = parseInt( '0x' + hex_str.substr(5, 2) ) / 255;
		}
		return ret;
	}
	return false;
}

function _ColorFloat32Hex(color_float3) {
	if(!Array.isArray(color_float3) || color_float3.length != 3) return false;
	var hexArr = [ Math.floor( color_float3[0] * 255 ).toString(16), Math.floor( color_float3[1] * 255 ).toString(16), Math.floor( color_float3[2] * 255 ).toString(16) ];
	for(var i = 0 ; i < hexArr.length; i++) { if(hexArr[i].length < 2) hexArr[i] = "0" + hexArr[i]; }
	
	return ('#' + hexArr[0] + hexArr[1] + hexArr[2]).toUpperCase();
}

function DomContentInliersOptions(objID, initShow) 
{
	var bShow = (typeof initShow == "boolean") ? initShow : true;
	var div = document.createElement('div');
	
	var title = document.createElement('h1');
	title.className = 'info_header';
	title.innerText = "Inliers: ";
	div.appendChild( title );
	
	var pElement = document.createElement('p');
	pElement.className = 'info_group';
	
	var color_btn = document.createElement('button');
	color_btn.className = "color_btn";
	color_btn.addEventListener('click', function() {
		var initColor = (gApp != null && (gApp instanceof WebGLApp)) ? _ColorFloat32Hex(gApp.GetInlierColor(objID)) : false;		
		OpenColorPickerDialog( initColor, function(colorHex) {
			if(gApp != null && (gApp instanceof WebGLApp)) {
				var color_float3 = _ColorHex2Float3(colorHex);
				if(color_float3 !== false) gApp.SetInlierColor(objID, color_float3);
			}
		} );
	});
	pElement.appendChild(color_btn);
	
	var toggle = document.createElement('span');
	toggle.className = 'toggle_btn';
	
	var dummy = document.createElement('input');
	dummy.type = 'checkbox';
	dummy.className = 'inliers';
	dummy.checked = bShow;
	dummy.addEventListener('click', function() {
		if(gApp != null && gApp instanceof WebGLApp) {
			gApp.SetInlierVisible(objID, this.checked);
		}
	});
	
	var imgBtn = document.createElement('button');
	
	toggle.appendChild(dummy);
	toggle.appendChild(imgBtn);
	
	pElement.appendChild(toggle);
	
	div.appendChild(pElement);
	
	return div;
}

function DomContentMeshOptions(objID, initShow)
{
	var bShow = (typeof initShow == "boolean") ? initShow : true;
	var div = document.createElement('div');
	
	var title = document.createElement('h1');
	title.className = 'info_header';
	title.innerText = "Mesh: ";
	div.appendChild( title );
	
	var pElement = document.createElement('p');
	pElement.className = 'info_group';
	
	var color_btn = document.createElement('button');
	color_btn.className = "color_btn";
	color_btn.addEventListener('click', function() {
		var initColor = (gApp != null && (gApp instanceof WebGLApp)) ? _ColorFloat32Hex(gApp.GetMeshColor(objID)) : false;		
		OpenColorPickerDialog( initColor, function(colorHex) {
			if(gApp != null && (gApp instanceof WebGLApp)) {
				var color_float3 = _ColorHex2Float3(colorHex);
				if(color_float3 !== false) gApp.SetMeshColor(objID, color_float3);
			}
		} );
	});
	pElement.appendChild(color_btn);
	
	var toggle = document.createElement('span');
	toggle.className = 'toggle_btn';
	
	var dummy = document.createElement('input');
	dummy.type = 'checkbox';
	dummy.className = 'mesh';
	dummy.checked = bShow;
	dummy.addEventListener('click', function() {
		if(gApp != null && gApp instanceof WebGLApp) {
			gApp.SetMeshVisible(objID, this.checked);
		}
	});
	
	var imgBtn = document.createElement('button');
	
	toggle.appendChild(dummy);
	toggle.appendChild(imgBtn);
	
	pElement.appendChild(toggle);
	
	div.appendChild(pElement);
	
	return div;
}

function DomContentOption(objID) {
	var div = document.createElement('div');
	
	var title = document.createElement('h1');
	title.className = 'info_header';
	title.innerText = "Option: ";
	div.appendChild( title );
	
	var pElement = document.createElement('p');
	pElement.className = 'info_group';
	
	var delBtn = document.createElement('button');
	delBtn.className = 'del_btn'
	delBtn.addEventListener('click', function() {
		myConfirm("Are you sure, you want to delete this object?", function() {
			var root = document.getElementById( objID );
			root.parentNode.removeChild(root);
			
			if(gApp != null && gApp instanceof WebGLApp) { gApp.RemoveObject( objID ); }
		});
	});
	
	pElement.appendChild(delBtn);
	div.appendChild(pElement);
	
	return div;
}

function DomContentInfo(info_arr_list)
{
	var div = document.createElement('div');
	
	var title = document.createElement('h1');
	title.className = 'info_header';
	title.innerText = "Info: ";
	div.appendChild(title);
	
	for(var i = 0; i < info_arr_list.length; i++) {
		var pElement = document.createElement('p');
		pElement.className = 'info_group';
		pElement.innerHTML = info_arr_list[i].join('<br/>');
		
		div.appendChild(pElement);
	}
	
	return div;
}

function DomContentArea(objID, info_arr_list, bShowMesh, bShowInliers) {
	var div = document.createElement('div');
	div.className = 'content';
	
	div.appendChild(DomContentInfo(info_arr_list));
	div.appendChild(DomContentMeshOptions(objID, bShowMesh));
	div.appendChild(DomContentInliersOptions(objID, bShowInliers));
	div.appendChild(DomContentOption(objID));
	
	return div;
}

function _ValidateObjectType(obj_param) {
	if(obj_param.type == 'torus') {
		if(obj_param.param.mr <= 0.0) {
			var confirm_msg = "Your Request Type is Torus,\nBut FindSurface Detect Different Type: " + (obj_param.param.mr < 0 ? "Cylinder" : "Sphere") + "\n\nUpdate or Discard it?";
			myConfirmCustom( confirm_msg, "Update", "Discard", function() {
				if( typeof obj_param.suggest == "object" ) {
					obj_param.type = obj_param.suggest.type;
					obj_param.param = obj_param.suggest.param;
					
					AppendInfo(obj_param);
				}
				else { myAlert(ERR_MSG_UNKNOWN_ERROR("Server Response Invalid Format")); }
			});
			return false;
		}
	}
	else if(obj_param.type == 'cone') {
		if(obj_param.param.tr == obj_param.param.br) {
			var confirm_msg = "Your Request Type is Cone,\nBut FindSurface Detect Different Type: Cylinder\n\nUpdate or Discard it?";
			myConfirmCustom( confirm_msg, "Update", "Discard", function() {
				obj_param.type = "cylinder";
				obj_param.param.r = obj_param.param.tr;
				
				AppendInfo(obj_param);
			});
			return false;
		}
	}
	
	return true;
}

function AppendInfo(obj_param) {
	if(typeof obj_param != "object" || typeof obj_param.type != "string" || typeof obj_param.param != "object") return;
	if(!_ValidateObjectType(obj_param)) return;
	
	var obj_info = null;
	var img_src = '';
	var typeName = '';
	var objNumber = gOPID++;
	var objID = '';
	
	var bShowMesh    = _getVisibleMesh();
	var bShowInliers = _getVisibleInliers();
	
	switch(obj_param.type)
	{
		case 'plane': 
			obj_info = MakePlaneInfo(obj_param.param);
			img_src = 'img/icon_plane.png';
			typeName = 'Plane ' + objNumber;
			objID = 'OBJ_PLANE_'+objNumber;
			break;
		case 'sphere': 
			obj_info = MakeSphereInfo(obj_param.param);
			img_src = 'img/icon_sphere.png';
			typeName = 'Sphere ' + objNumber;
			objID = 'OBJ_SPHERE_'+objNumber;
			break;
		case 'cylinder': 
			obj_info = MakeCylinderInfo(obj_param.param);
			img_src = 'img/icon_cylinder.png';
			typeName = 'Cylinder ' + objNumber;
			objID = 'OBJ_CYLINDER_'+objNumber;
			break;
		case 'cone': 
			obj_info = MakeConeInfo(obj_param.param);
			img_src = 'img/icon_cone.png';
			typeName = 'Cone ' + objNumber;
			objID = 'OBJ_CONE_'+objNumber;
			break;
		case 'torus': 
			obj_info = MakeTorusInfo(obj_param.param);
			img_src = 'img/icon_torus.png';
			typeName = 'Torus ' + objNumber;
			objID = 'OBJ_TORUS_'+objNumber;
			break;
		default: return;
	}
	
	var inliers_cnt = 0;
	for(var i = 0; i < obj_param.flags.length; i++) {
		if(obj_param.flags[i] == 0) ++inliers_cnt;
	}
	
	// GL Element
	if(gApp != null && gApp instanceof WebGLApp) { 
		gApp.AppendObject(objID, obj_param);
		gApp.SetMeshVisible(objID, bShowMesh);
		gApp.SetInlierVisible(objID, bShowInliers);
	}
	else { console.log('gApp is not initialized!!'); }
	
	// Outliers
	UpdateOutliersInfo( gApp.pointcloud.count );
	
	// UI Element
	var root = document.createElement('div');
	root.id = objID;
	root.className = 'collapsible';
	
	var btn = DomTitleButton(objID, img_src, typeName);
	root.appendChild( btn );
	root.appendChild( DomContentArea(objID, [ ['RmsErr: ' + obj_param.rms ], obj_info, ['Inlier Points : ' + inliers_cnt ] ], bShowMesh, bShowInliers) );
	
	document.getElementById('INFO_WINDOW').appendChild(root);
	btn.click();
}

function DeselectInfoAll() {
	var btnList = document.querySelectorAll('#INFO_WINDOW div.collapsible > button.active');
	for(var i = 0; i < btnList.length; i++) {
		btnList[i].classList.remove('active');
		var content = btnList[i].nextElementSibling;
		content.style.maxHeight = null;
		content.style.display = 'none';
	}
	
	if( gApp != null && gApp instanceof WebGLApp ) { gApp.DeselectAll(); }
}

function UpdateOutliersInfo(cnt) {
	var OUTLIERS_ID = 'OUTLIERS_NODE';
	var target = document.getElementById( OUTLIERS_ID );
	var targetStr = "Outliers: " + Number(cnt);
	
	if( target == null ) {
		var infoWnd = document.getElementById('INFO_WINDOW');
		if(infoWnd) {
			var div = document.createElement('div');
			div.id = OUTLIERS_ID;
			div.className = 'content';
			div.innerText = targetStr;
			
			if( infoWnd.childNodes.length > 0) {
				infoWnd.insertBefore(div, infoWnd.childNodes[0]);
			}
			else {
				infoWnd.appendChild(div);
			}
		}
		else { console.log("error"); return; }
	}
	else {
		target.innerText = targetStr;
	}
}

function ClearInfoList() {
	gOPID = 1;
	document.getElementById('INFO_WINDOW').innerHTML = '';
}

function SetVisibleMesh(bShow) { 
	_SetVisibleCheckbox(bShow, 'mesh');
	if(gApp != null && gApp instanceof WebGLApp) {
		gApp.SetAllMeshVisible(bShow);
	}
}
function SetVisibleInliers(bShow) {
	_SetVisibleCheckbox(bShow, 'inliers');
	if(gApp != null && gApp instanceof WebGLApp) {
		gApp.SetAllInlierVisible(bShow);
	}
}
function _SetVisibleCheckbox(bShow, which) {
	if(typeof which != "string") return;
	
	var nodeList = [];
	which = which.toLowerCase();
	if(which == 'mesh') {
		nodeList = document.querySelectorAll('#INFO_WINDOW input[type=checkbox].mesh');
	}
	else if(which == 'inliers') {
		nodeList = document.querySelectorAll('#INFO_WINDOW input[type=checkbox].inliers');
	}
	
	for(var i = 0; i < nodeList.length; i++) {
		nodeList[i].checked = bShow;
	}
}