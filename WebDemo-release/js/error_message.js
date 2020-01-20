/*!
 * File: error_message.js
 * Author: Jin-gyu Choi <jkchoi@curvsurf.com>
 * 
 * Released under the MIT license
 * Copyright 2019 CurvSurf, Inc.
 */

/* Menu */
var ERR_MSG_OPEN_POINT_FIRST = "Please open point cloud data first!";

/* File Open Dialog */
var ERR_MSG_FILE_SELECT = "Please select your file first";
var ERR_MSG_PC_SELECT = "Please select point cloud data";
var ERR_MSG_INVALID_POINT_DATA = "Invalid point cloud data";
var ERR_MSG_CONFIRM_DOWNSAMPLING = "There are too many data points\n(Maximum Handling: 500,000)\n\nDo you want to downsample or cancel loading?";

var ERR_MSG_WEBGL_FAILED = "Unknown error has occured while initializing WebGL Context";
var ERR_MSG_WEBGL_SUPPORT = "Your browser does not support WebGL\nUpdate your browser or try a differnt one (like Google-Chrome)";

/* Point Reader */
var ERR_MSG_INVALID_FILE_INSTANCE = "LoadPointCloudFromFile() - Invalid Access\n> Passed parameter is not File instance";
var ERR_MSG_TOO_HUGE_FILE_SIZE = "File size is too huge ( > 70 MB )";
var ERR_MSG_INVALID_FILE_EXTENSION = "LoadPointCloudFromFile() - Invalid Access\n> Check your file extension.\nWe only support .xyz or .obj";
var ERR_MSG_INVALID_RESPONSE = "Response Error: Invalid Response Format!!";
var ERR_MSG_RESPONSE_ERROR = function(msg) { return "Response Error: " + msg;}

/* Find Surface */
var ERR_MSG_NO_PICKING_POINT = "No point is picked";
var ERR_MSG_NOT_FOUND = "Not Found";
var ERR_MSG_INVALID_REQUEST = function(msg) { return "Invalid Request:\n    > " + msg; }
var ERR_MSG_UNKNOWN_ERROR = function(msg) { return "Unknown error has occured:\n    > " + msg; }

var ERR_MSG_SESSION_OUT = "Your session may have timed out\nPlease sign in again";
var ERR_MSG_TIMEOUT = "Server does not respond in the expected time";
