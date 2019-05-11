var SWORD = SWORD || {};

SWORD.Point = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

SWORD.Rectangle = function(x, y, width, height) {
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
};

SWORD.DisplayObject = function() {
	// 位置
	this.position = new SWORD.Point();
	// 比例
	this.scale = new SWORD.Point(1,1);
	// 以弧度为单位的旋转
	this.rotation = 0;
	// 透明度
	this.alpha = 1;
	// 是否可见
	this.visible = true;

	// 父级
	this.parent = null;
	// 舞台
	this.stage = null;

	// 碰撞区域
	this.hitArea = null;

	// 是否与鼠标或触碰交互
	this.interactive = false;
};

SWORD.DisplayObject.prototype.setInteractive = function(interactive) {
	this.interactive = interactive;
	if (this.stage) this.stage.dirty = true;
};

SWORD.DisplayObject.prototype.updateTransform = function() {

};

SWORD.DisplayObjectContainer = function() {
	SWORD.DisplayObject.call( this );
	// 精灵/孩子们
	this.children = [];
	this.renderable = false;
};

SWORD.DisplayObjectContainer.prototype = Object.create( SWORD.DisplayObject.prototype );

// 添加孩子
SWORD.DisplayObjectContainer.prototype.addChild = function(child) {
	if(child.parent != undefined)
	{
		child.parent.removeChild(child)
	}
	
	child.parent = this;
	child.childIndex = this.children.length;
	
	this.children.push(child);	
	if(this.stage)
	{
		this.stage.__addChild(child);
	}
};

// 移出孩子
SWORD.DisplayObjectContainer.prototype.removeChild = function(child) {
	var index = this.children.indexOf( child );

	if ( index !== -1 ) 
	{
		if(this.stage)this.stage.__removeChild(child);
		child.parent = undefined;
		//child.childIndex = 0
		this.children.splice( index, 1 );
	
		// update in dexs!
		for(var i=index,j=this.children.length; i<j; i++)
		{
			this.children[i].childIndex -= 1;
		}
	}
	else
	{
		throw new Error(child + " The supplied DisplayObject must be a child of the caller " + this);
	}
};

SWORD.DisplayObjectContainer.prototype.updateTransform = function() {
	if(!this.visible) return;
	
	SWORD.DisplayObject.prototype.updateTransform.call( this );
	
	for(var i=0,j=this.children.length; i<j; i++)
	{
		this.children[i].updateTransform();	
	}
};


SWORD.Sprite = function() {
	SWORD.DisplayObjectContainer.call( this );
};

SWORD.Sprite.prototype = Object.create( SWORD.DisplayObjectContainer.prototype );

console.log(new SWORD.Sprite());

SWORD.Animation = function(sprite) {
	this.sprite = sprite;
	this.body = sprite.body;
	// 播放状态
	this.play = true;
	// 记录最近一次动作变化的动作类型
	this.currentActionType = this.body.type;
	// 当前动作信息
	this.actionInfo = this.body.action[this.body.type];
	// 当前动作的时间戳(帧率)
	this.deltaTime = this.actionInfo.frameRate;
	this.cooldown = 0;
	// 当前播放帧
	this.frames = 0;
};

// 下一帧动画
SWORD.Animation.prototype = {
	nextFrame: function() {
		// 更新动画
		this.deltaTime = this.actionInfo.frameRate;
		this.body.width = this.actionInfo.width;
		this.body.height = this.actionInfo.height;

		switch (this.sprite.face) {
			case 'up':
				this.body.x = this.actionInfo.face.up.x + this.actionInfo.width * this.frames;
				this.body.y = this.actionInfo.face.up.y;
				break;
			case 'down':
				this.body.x = this.actionInfo.face.down.x + this.actionInfo.width * this.frames;
				this.body.y = this.actionInfo.face.down.y;
				break;
			default:
				this.body.x = this.actionInfo.face.right.x + this.actionInfo.width * this.frames;
				this.body.y = this.actionInfo.face.right.y;
		}

		// 判断动作折行的情况
		if ( this.body.x >= this.body.img.width ) {
			var multiple = ~~(this.body.x/this.body.img.width);
			this.body.x -= this.body.img.width*multiple;
			this.body.y += this.body.height*multiple;
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
				this.play = false;
			}
		}
	},
	// 如果动作类型发生变化
	change: function() {
		
		if (this.body.type === this.currentActionType) return false;

		this.play = true;
		this.currentActionType = this.body.type;
		this.actionInfo = this.body.action[this.body.type];
		this.frames = 0;

		return true;
	},
	// 更新动画
	update: function() {
		
		// 监听动作状态变化，如果发生变化，则执行动画播放
		if (this.change()) this.deltaTime = 0;

		// 是否可以播放
		if (!this.play) return false;

		// if (this.cooldown > 0) {
		// 	this.cooldown -= this.sprite.deltaTime;
		// 	return false;
		// }

		// 判断时间戳
		if (this.deltaTime > 0) {
			this.deltaTime -= this.sprite.deltaTime;
			if (this.cooldown > 0) {
				this.cooldown -= this.sprite.deltaTime;
			}
		} else {
			this.nextFrame();
			// 触发伤害的那一帧
			if (this.actionInfo.event && this.actionInfo.event[this.frames]) {
				this.actionInfo.event[this.frames](this.sprite);
				return true;
			}
		}
		return false;
	}
}
