/*!
 * File: point_util.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

function SamplePointsQuarter(pointList)
{
	if(!Array.isArray(pointList) || pointList.length % 3 != 0) {
		myAlert("SamplePointQuarter() - Invalid Parameter: input array is not expected"); 
		return; 
	}
	
	return SamplePoints(pointList, Math.floor( (pointList.length / 3) / 4 ));
}

function SamplePoints(pointList, targetSize) {
	if(!Array.isArray(pointList) || pointList.length % 3 != 0) {
		myAlert("SamplePoint() - Invalid Parameter: input array is not expected"); 
		return false; 
	}
	
	if(typeof targetSize != "number" || targetSize < 1) {
		myAlert("SamplePoint() - Invalid Parameter: target sample size is too small or not expected"); 
		return false;
	}
	targetSize = Math.floor(targetSize);
	
	if( targetSize / (pointList.length / 3) > 0.9 ) {
		console.log("SamplePoint() - Invalid Parameter: target sample size is over 90% of original data size");
		return pointList;
	}
	
	var currSize = Math.floor( pointList.length / 3 );
	var tmp = [0, 0, 0];
	for( var i = 0; i < targetSize ; i++ ) {
		var idx = Math.floor( Math.random() * currSize );
		--currSize;
		
		// Swap
		tmp[0] = pointList[3 * idx];
		tmp[1] = pointList[3 * idx + 1];
		tmp[2] = pointList[3 * idx + 2];
		
		pointList[3 * idx] = pointList[3 * currSize];
		pointList[3 * idx + 1] = pointList[3 * currSize + 1];
		pointList[3 * idx + 2] = pointList[3 * currSize + 2];
		
		pointList[3 * currSize] = tmp[0];
		pointList[3 * currSize + 1] = tmp[1];
		pointList[3 * currSize + 2] = tmp[2];
		// Swap
	}
	
	return pointList.splice( pointList.length - (3 * targetSize), 3 * targetSize );
}