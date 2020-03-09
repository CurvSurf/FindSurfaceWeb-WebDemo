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

function RequestFindSurface(type, requestData, onsend, onprogress, onload, ontimeout, onloadend)
{
	if( !(requestData instanceof ArrayBuffer) ) { return; }
	var reqURL = "https://developers.curvsurf.com/FindSurface/"+type+".json";

	var xhttp = new XMLHttpRequest();
	
	xhttp.upload.onprogress = onprogress;
	
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
		
		onload(resp);
	}
	
	xhttp.ontimeout = ontimeout;
	xhttp.onloadend = onloadend;
	xhttp.open("POST", reqURL, true);
	xhttp.setRequestHeader("Content-type", "application/x-findsurface-request");

	onsend();
	xhttp.send(requestData);
}