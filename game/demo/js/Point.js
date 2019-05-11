
/***
* 坐标
*
* @constructor Point
* @param {number} x 坐标位置x
* @param {number} y 坐标位置y
* @example
*		new SWORD.Point(100, 100);
*/

SWORD.Point = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

/**
 * @method clone
 * @extend {SWORD.Point}
 * @return a copy of the point
 */
SWORD.Point.prototype.clone = function(){
	return new SWORD.Point(this.x, this.y);
}