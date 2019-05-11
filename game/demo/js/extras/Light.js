SWORD.Light = function(imgUrl){
	SWORD._Sprite.call(this, SWORD.Texture.fromImage(imgUrl));
};

SWORD.Light.prototype = Object.create(SWORD._Sprite.prototype);

SWORD.Light.prototype.updateTransform = function(){
	this.position.x = this.parent.position.x + ~~(this.parent.texture.frame.width/2) - ~~(this.texture.frame.width/2);
	this.position.y = this.parent.position.y + this.parent.texture.frame.height - this.texture.frame.height;
};