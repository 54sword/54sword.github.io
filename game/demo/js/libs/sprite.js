

SWORD._Sprite = function(texture){

	SWORD.DisplayObjectContainer.call(this);

	this.texture = texture;

	this.position = new SWORD.Point;

	this.renderable = true;
};

SWORD._Sprite.prototype = Object.create(SWORD.DisplayObjectContainer.prototype);