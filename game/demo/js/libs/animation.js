
/**
 * 继承动画精灵
 * @class SWORD.AnimationSprite
 * @param {object} texture
 * @param {object} action
 */
	 
SWORD.AnimationSprite = function(texture, action) {

	SWORD._Sprite.call(this, new SWORD.Texture(texture.baseTexture, new SWORD.Rectangle));

	// 精灵所有的动作
	this.action = action;
	// 精灵当前的动作
	this.actionType = this.action['stand'] ? 'stand' : 'run';
	// 缓存
	this._currentActionType = this.action['stand'] ? 'stand' : 'run';
	// 播放状态
	this.playing = true;
	// 当前动作信息
	this.actionInfo = this.action[this.actionType];
	// 动画播放的时间戳
	this._deltaTime = this.action[this.actionType].frameRate;
	// cd
	this.cooldown = 0;
	// 当前播放帧
	this.frames = 0;
	this.currentFrame = 0;

	this.face = 'left';		// up left down right

	this.nextFrame();
};

SWORD.AnimationSprite.prototype = Object.create(SWORD._Sprite.prototype);

// 下一帧动画
SWORD.AnimationSprite.prototype.nextFrame = function() {

	var frame = this.texture.frame;
	// 更新动画
	this._deltaTime = this.actionInfo.frameRate;
	frame.width = this.actionInfo.width;
	frame.height = this.actionInfo.height;

	switch (this.face) {
		case 'up':
			frame.x = this.actionInfo.face.up.x + this.actionInfo.width * this.frames;
			frame.y = this.actionInfo.face.up.y;
			break;
		case 'down':
			frame.x = this.actionInfo.face.down.x + this.actionInfo.width * this.frames;
			frame.y = this.actionInfo.face.down.y;
			break;
		default:
			frame.x = this.actionInfo.face.right.x + this.actionInfo.width * this.frames;
			frame.y = this.actionInfo.face.right.y;
	}

	// 判断动作折行的情况
	if ( frame.x >= this.texture.baseTexture.width ) {
		var multiple = ~~(frame.x/this.texture.baseTexture.width);
		frame.x -= this.texture.baseTexture.width*multiple;
		frame.y += frame.height*multiple;
	}
	
	this.frames++;
	
	// 判断播放完到最后一帧后，返回到一帧
	if (this.frames === this.actionInfo.frames) {
		if (this.actionInfo.loop) {
			this.frames = 0;
			if (this.actionInfo.cooldown) {				
				this.cooldown = this.actionInfo.cooldown;
			}
		} else {
			this.playing = false;
		}
	}
};
	// 如果动作类型发生变化
SWORD.AnimationSprite.prototype.change = function() {
	
	if (this.actionType === this._currentActionType) return false;

	this.playing = true;
	this._currentActionType = this.actionType;
	this.actionInfo = this.action[this.actionType];
	this.frames = 0;
	
	return true;
};

/**
 * 改变动画的方向
 * 
 * @method changeFace
 * @param {number} a 自己当前网格id
 * @param {number} b 参照物的网格id
 * @example
 *		this.changeFace(5, 6);
 * @return null
 */

SWORD.AnimationSprite.prototype.changeFace = function(a, b){

	a = grid.array[a];
	b = grid.array[b];
	
	switch (true) {
		case a.x === b.x && a.y < b.y : this.face = 'down'; break;
		case a.x === b.x && a.y > b.y : this.face = 'up'; break;
		case a.y === b.y && a.x < b.x : this.face = 'right'; break;
		case a.y === b.y && a.x > b.x : this.face = 'left'; break;
	}
	/*
	switch (true) {
		case a === b - 1: this.face = 'right'; break;
		case a === b + 1: this.face = 'left';  break;
		case a > b: 	  this.face = 'up';	   break;
		case a < b: 	  this.face = 'down';  break;
	}
	*/
};

// 更新动画
SWORD.AnimationSprite.prototype.updateTransform = function() {

	SWORD._Sprite.prototype.updateTransform.call(this);
	
	// 监听动作状态变化，如果发生变化，则执行动画播放
	if (this.change()) this._deltaTime = 0;
	
	// 是否可以播
	if (!this.playing) return false;

	// 判断时间戳
	if (this._deltaTime > 0) {
		this._deltaTime -= this.deltaTime;
		if (this.cooldown > 0) {
			this.cooldown -= this.deltaTime;
		}
	} else {
		this.nextFrame();
		// 触发伤害的那一帧
		if (this.actionInfo.event && this.actionInfo.event[this.frames]) {
			this.actionInfo.event[this.frames](this);
			return true;
		}
	}
	return false;
};
