/*!
 * File: find_surface.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function MakeRequestBody( accuracy, meanDist, touchR, seedIdx, radExp, latExt, points ) {
	var headerSize = 40;
	var pointDataLength = points.length * Float32Array.BYTES_PER_ELEMENT;
	var pointCount = Math.floor( points.length / 3 ); // points is tightly packed x, y, z float array

	var requestBody = new ArrayBuffer( headerSize + pointDataLength );
	
	var headerPart = new DataView( requestBody, 0, headerSize );
	var dataPart = new Float32Array( requestBody, headerSize );

	// Fill Header
	headerPart.setUint8  ( 0x00, 0x46 ); // 'F'
	headerPart.setUint8  ( 0x01, 0x53 ); // 'S'
	headerPart.setUint8  ( 0x02, 0x01 ); // major - 1
	headerPart.setUint8  ( 0x03, 0x00 ); // minor - 0
	headerPart.setUint32 ( 0x04, headerSize, true );
	headerPart.setUint32 ( 0x08, pointCount, true );
	headerPart.setUint32 ( 0x0C, 0, true );     // offset
	headerPart.setUint32 ( 0x10, 3 * Float32Array.BYTES_PER_ELEMENT, true ); // stride
	headerPart.setFloat32( 0x14, accuracy, true );  // Measurement Accuracy
	headerPart.setFloat32( 0x18, meanDist, true );  // Mean Distance
	headerPart.setFloat32( 0x1C, touchR, true );    // Touch Radius
	headerPart.setUint32 ( 0x20, seedIdx, true );   // Seed Index
	headerPart.setUint8  ( 0x24, 0 );           // Not used
	headerPart.setUint8  ( 0x25, radExp );      // Rad. Exp.
	headerPart.setUint8  ( 0x26, latExt );      // Lat. Ext.
	headerPart.setUint8  ( 0x27, 0x01 );        // Options ( Request Flags of In/Outliers )

	// Fill Data
	dataPart.set( points );

	return requestBody;
}

function RequestFindSurface(type, requestData)
{
	if( !(requestData instanceof ArrayBuffer) ) { return; }
	var reqURL = "https://developers.curvsurf.com/FindSurface/"+type+".json";

	var xhttp = new XMLHttpRequest();
	
	xhttp.upload.onprogress = function(event) {
		var progress_div = document.getElementById("REQ_UPLOAD_PROGRESS_BAR");
		if(event.loaded < event.total) {
			var progress = document.getElementById("REQ_UPLOAD_PROGRESS");
			if(progress) { progress.style.display = "block"; }
			if(progress_div) {
				var pct = ((event.loaded / event.total) * 100);
				progress_div.style.width = Math.floor( pct ) + '%';
				progress_div.innerHTML = Math.floor( pct ) + '%';
			}
		}
		else { // upload complete
			var title = document.getElementById("REQ_UPLOAD_TITLE");
			if(title) { title.innerHTML = "Wait for Server Response"; }
			if(progress_div) { progress_div.parentNode.removeChild(progress_div); }
		}
	}
	
	xhttp.onload = function() {
		var resp = null;
		if(this.status == 200) {
			try{ 
				resp = JSON.parse(this.responseText); 
				if(resp.header != 'FSWEB') { throw 'Invalid Response'; } 
			} 
			catch(e) { resp = { "header" : "FSWEB", "version" : "1.0", "code" : -2, "result" : "Invalid Response Format" }; }
		}
		else {
			resp = { "header" : "FSWEB", "version" : "1.0", "code" : -2, "result" : ("Response Error: " + this.statusText + '(' + this.status + ')') };
		}
		
		switch(resp.code) {
			case 0: AppendInfo(resp.result); break;
			case 1: myAlert(ERR_MSG_NOT_FOUND); break;
			case -2: myAlert(ERR_MSG_INVALID_REQUEST(resp.result)); break;
			case -1: default: myAlert(ERR_MSG_UNKNOWN_ERROR(resp.result)); break;
		}
	}
	
	xhttp.ontimeout = function() { myAlert(ERR_MSG_TIMEOUT); }
	xhttp.onloadend = function() { 
		CloseProgressDialog();
		if(gApp != null && gApp instanceof WebGLApp) {
			gApp.ShowTouchArea(false);
		}
	}

	xhttp.open("POST", reqURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-findsurface-request");

	OpenProgressDialog('<div>Request FindSurface to Server<br/>Please Wait a few minutes</div><div><h3 id="REQ_UPLOAD_TITLE">Request Uploading...</h3><div id="REQ_UPLOAD_PROGRESS"><div id="REQ_UPLOAD_PROGRESS_BAR">Uploading...</div></div></div>');
	xhttp.send(requestData);
}