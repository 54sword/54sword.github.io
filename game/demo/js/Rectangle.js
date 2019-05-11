SWORD.Rectangle = function(x, y, width, height){
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
};

/** 
 * @method clone
 * @return a copy of the point
 */
SWORD.Rectangle.prototype.clone = function(){
	return new SWORD.Point(this.x, this.y, this.width, this.height);
}