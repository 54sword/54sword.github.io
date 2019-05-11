SWORD.AssetLoader = function(assetURLs){
	this.assetURLs = assetURLs;
	this.loadCount = 0;
};

SWORD.AssetLoader.prototype.load = function(){

	this.loadCount = this.assetURLs.length;

	var scope = this;
	this.loaded = function(event){
		scope.onAssetLoaded(event);
	};
	
	for (var i = 0, max = this.assetURLs.length; i < max; i++) {
		
		var loader = new SWORD.Texture.fromImage(this.assetURLs[i]);

		if (!loader.baseTexture.hasLoaded) {
			loader.baseTexture.addEventListener('loaded', this.loaded);
		} else {
			this.onAssetLoaded();
		}
	}
};

SWORD.AssetLoader.prototype.onAssetLoaded = function(event) {
    this.loadCount--;
	if (this.onProgress) this.onProgress();
	if (this.loadCount == 0) {
		if (event) event.content.removeEventListener('loaded', this.loaded);
		if(this.onComplete) this.onComplete();
	}
};