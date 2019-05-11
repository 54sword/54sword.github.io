// 图片的缓存
SWORD.TextureCache = {};

// 图片或图片的一部分
SWORD.Texture = function(baseTexture, frame){
	
	// 如果没有帧，那么则是原图片的原始尺寸
	this.baseTexture = baseTexture;
	
	if (!frame) {
		this.noFrame = true;
		frame = new SWORD.Rectangle(0, 0, 1, 1);
	}

	this.frame = frame;
	
	if (baseTexture.hasLoaded) {
		this.frame = new SWORD.Rectangle(0, 0, baseTexture.width, baseTexture.height);
	} else {
		var scope = this;
		this.loadedCallback = function(event) {
			scope.baseTexture.removeEventListener('loaded', scope.loadedCallback);
			scope.frame = new SWORD.Rectangle(0, 0, scope.baseTexture.width, scope.baseTexture.height);
		};
		// 如果图片还没有加载完成，那么监听loaded事件
		baseTexture.addEventListener('loaded', this.loadedCallback);
	}
};

// 加载图片缓存，如果图片没有缓存，那么加载图片
SWORD.Texture.fromImage = function(imageUrl){
	var texture = SWORD.TextureCache[imageUrl];
	if (!texture) {
		texture = new SWORD.Texture(SWORD.BaseTexture.fromImage(imageUrl));
		SWORD.TextureCache[imageUrl] = texture;
	}
	return texture;
};