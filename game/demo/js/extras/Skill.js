SWORD.Skill = function(texture, spriteObject, sprite, id){
	
	SWORD.AnimationSprite.call(this, texture, spriteObject.action);

	this.sprite = sprite;
	this.targetObject =  sprite.enemy;

	// 当前所在网格的位置
	this.currentGridID = sprite.currentGridID;
	
	// 偏移位置
	this.offset = spriteObject.offset;
	
	// 每次移动的间隔
	this.moveDwellTime = spriteObject.moveframeRate;

	this.foot = new SWORD.sKillFoot(this);
};

SWORD.Skill.prototype = Object.create(SWORD.AnimationSprite.prototype);

SWORD.Skill.prototype.updateTransform = function(){
	
	SWORD.AnimationSprite.prototype.updateTransform.call(this);

	if (!this.playing) {
		this.visible = false;
	}
	
	if (this.foot.updateTransform()) {
		this.actionType = 'collision';
		hurt(this.sprite);
	}
};

// 精灵的脚
// 监听sprite.movetogrid的变化，如果发生变化，则会自动开始寻找移动路线
SWORD.sKillFoot = function(sprite){
	
	// 将sprite
	SWORD.Move.call(this, sprite.moveDwellTime, 12, sprite.position);

	sprite.position.x = grid.array[sprite.currentGridID].position.x;
	sprite.position.y = grid.array[sprite.currentGridID].position.y;
	
	// 初始化开始的坐标位置
	this.changeEndPosition(
		sprite.targetObject.position.x,
		sprite.targetObject.position.y
	);
};

SWORD.sKillFoot.prototype = Object.create(SWORD.Move.prototype);

// 更新数据
// 如果返回是true,那么说明正在移动
// 如果返回是false,那么说明没有路线或已经移动完成
SWORD.sKillFoot.prototype.updateTransform = function(){
	return SWORD.Move.prototype.updateTransform.call(this) ? true : false;
};
