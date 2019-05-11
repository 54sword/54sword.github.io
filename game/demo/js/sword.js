
/**
 * Sword.JS - v1.0.0
 * Copyright (c) 2013, 54sword
 *
 * Compiled: 2013-06-04
 *
 * @author 54sword
 * @email 54sword@gmail.com
 */

"use strict";

/**
 * @module SWORD
 */
var SWORD = SWORD || {};

// SWORD.Extend = function(destination, source) {
// 	for (var prop in source) {
// 		if (source.hasOwnProperty(prop)) {
// 			if (!destination[prop]) {
// 				destination[prop] = source[prop];
// 			} else {
// 				throw new Error(destination + " This attribute object already exists "+prop);
// 			}
// 		}
// 	}
// };

SWORD.log = function(srt) {
	try { console.log(srt); } catch (e) {}
};

var requestAnimationFrame = window.requestAnimFrame = (function() {
 return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			window.setTimeout(callback, 1000/60);
		};
})();

// 随机打乱数组
SWORD.randomDisruptedArray = function(array){
	return array.sort(function(){ return 0.5 - Math.random() });
};