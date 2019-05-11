// 舞台
SWORD.Stage = function(){

	SWORD.DisplayObjectContainer.call(this);

	this.timer = new SWORD.Timer();
	
	// 精灵的容器
	this.sprites = [];
	this.removeSpriteCache = [];
	// 焦点精灵
	this.focusSpriteId = 0;
};

SWORD.Stage.prototype = Object.create(SWORD.DisplayObjectContainer.prototype);

SWORD.Stage.prototype.addSprite = function(sprite){
	
	sprite.deltaTime = this.timer.deltaTime;
	this.sprites.push(sprite);
};

SWORD.Stage.prototype.removeSprite = function(sprite){
	
	// grid.array[sprite.currentGridID].sprite = null;
	// grid.array[sprite.currentGridID].mark = 0;

	var index = this.sprites.indexOf(sprite);
	
	if (index !== -1) {
		this.sprites.splice(index, 1);
	}
};

SWORD.Stage.prototype.queue = function(a, b){
	var ay = a.position.y + a.texture.frame.height;
	var by = b.position.y + b.texture.frame.height;
	if (ay === by) {
		return a.position.x > b.position.x ? 1 : -1;
	} else {
		return ay - by;
	}
};

SWORD.Stage.prototype.updateTransform = function(){
	
	this.timer.tick();
	
	// 如果对象已经死亡，那么移出在网格上的信息
	for (var i = 0, length = this.sprites.length; i < length; i++) {
		if (this.sprites[i].actionType === 'death') {
			if (grid.array[this.sprites[i].currentGridID].sprite && grid.array[this.sprites[i].currentGridID].sprite.id === this.sprites[i].id) {
				grid.array[this.sprites[i].currentGridID].mark = 0;
				grid.array[this.sprites[i].currentGridID].sprite = null;
			}
		}
	}
	
	// 移除精灵
	for (var i = 0, length = this.removeSpriteCache.length; i < length; i++) {
		this.removeSprite(this.removeSpriteCache[i]);
	}
	
	this.removeSpriteCache.length = 0;
	
	// 渲染精灵
	for (var i = 0, length = this.sprites.length; i < length; i++) {
		if (!this.sprites[i] || !this.sprites[i].visible) {
			this.removeSpriteCache.push(this.sprites[i]);
			continue;
		}
		this.sprites[i].deltaTime = this.timer.deltaTime;
		this.sprites[i].updateTransform();
		if (this.focusSpriteId === this.sprites[i].id) {
			show.updateTransform(this.sprites[i]);
			this.sprites[i].scale.x = 1.2;
			this.sprites[i].scale.y = 1.2;
		} else {
			this.sprites[i].scale.x = 1;
			this.sprites[i].scale.y = 1;
		}
	}
	
	this.sprites.sort(this.queue);
};