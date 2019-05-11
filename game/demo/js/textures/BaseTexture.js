// 图片缓存
SWORD.BaseTextureCache = {};
// 图片的原始大小
SWORD.BaseTexture = function(source){

	SWORD.EventTarget.call(this);

	this.width = 100;
	this.height = 100;
	this.source = source;
	this.hasLoaded = false;
	
	var scope = this;
	var loaded = function(){
		scope.hasLoaded = true;
		scope.width = scope.source.width;
		scope.height = scope.source.height;
	};
	
	if (this.source instanceof Image) {
		if (this.source.complete) {
			loaded();
		} else {
			this.source.onload = function(){
				loaded();
				scope.dispatchEvent( { type: 'loaded', content: scope } );
			};
		}
	}
};

SWORD.BaseTexture.fromImage = function(imageUrl){
	var baseTexture = SWORD.BaseTextureCache[imageUrl];
	if (!baseTexture) {
		var image = new Image();
		image.src = imageUrl;
		baseTexture = new SWORD.BaseTexture(image);
		SWORD.BaseTextureCache[imageUrl] = baseTexture;
	}
	return baseTexture;
};