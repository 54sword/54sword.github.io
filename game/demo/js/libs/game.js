// 舞台
SWORD.Stage = function(canvas, width, height){
	this.width = width || 960;
	this.height = height || 640;
	this.canvas = canvas;
	// 定时期
	this.timer = new SWORD.class.Timer();
	// 渲染
	this.renderer = new SWORD.CanvasRenderer(width, height, this.canvas);
	// 精灵的容器
	this.sprites = [];
	this.removeSpriteCache = [];
	// 焦点精灵
	this.focusSpriteId = 0;
};

SWORD.Stage.prototype.addSprite = function(sprite){
	this.sprites.push(sprite);
};

SWORD.Stage.prototype.removeSprite = function(sprite){
	var index = this.sprites.indexOf(sprite);
	if (index) this.sprites.splice(index, 1);
};

SWORD.Stage.prototype.arrange = function(a, b){
	var ay = a.y + a.body.height;
	var by = b.y + b.body.height;
	if (ay === by) {
		return a.x > b.x ? 1 : -1;
	} else {
		return ay - by;
	}
};

SWORD.Stage.prototype.updateTransform = function(){
	this.renderer.clear();
	this.timer.tick();

	// 删除精灵
	var length = this.removeSpriteCache.length;
	if (this.removeSpriteCache.length) {
		for (var i = 0; i < length; i++) {
			for (var n = 0, j = this.sprites.length; n < j; n++) {
				if (this.sprites[n].id === this.removeSpriteCache[i]) {
					this.removeSprite(this.sprites[n]);
					break;
				}
			}
		}
	}
	
	this.removeSpriteCache.length = 0;

	this.sprites.sort(this.arrange);

	// 渲染精灵
	for (var i = 0, max = this.sprites.length; i < max; i++) {
		if (!this.sprites[i]) continue;
		if (!this.sprites[i].visible) {
			this.removeSpriteCache.push(this.sprites[i].id);
			continue;
		}
		this.renderer.displayObject(this.sprites[i]);
		this.renderer.hp(this.sprites[i]);
		//this.renderer.showInfo(this.sprites[i]);
		this.sprites[i].deltaTime = this.timer.deltaTime;
		this.sprites[i].update();
	}
};