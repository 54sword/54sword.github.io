
var hurt = function(sprite){
	// 攻击力
	var attackForce = sprite.actionInfo.attackForce;

	if (!attackForce || !sprite.enemy) return;
	
	var arr = {
		x: sprite.enemy.position.x + sprite.texture.frame.width/2,
		y: sprite.enemy.position.y + 5,
		num: SWORD.Math.randomNumber(attackForce.min, attackForce.max),
		frame: 0
	};
	
	if (sprite.enemy.hp.harm(arr.num)) {
		sprite.enemy.actionType = 'death';
		sprite.attackStatus = false;
	}
};

SWORD.Role = function(texture, spriteObject, id, team){
	
	SWORD.AnimationSprite.call(this, texture, spriteObject.action);

	this.grid = grid.array;
	
	this.currentGridID = id;				// 当前所在网格的位置
	// grid.array[id].mark = id + 100;			// 标记在网格的位置
	// grid.array[id].sprite = this;			// 标记在网格的位置
	this.vision = spriteObject.vision;		// 视野范围
	
	this.id = id + 100;						// id
	this.team = team;						// 队伍
	this.enemy = false;
	
	this.attackStatus = false;				// 战斗状态/false未进入战斗状态/true进入战斗状态
	this.enemy = null;						// 敌人
	
	// 是否被用户控制
	this.controlled = false;
	
	// 偏移位置
	this.offset = spriteObject.offset;
	
	// 每次移动的间隔
	this.moveDwellTime = spriteObject.moveframeRate;
	
	this.foot = new SWORD.Foot(this);
	this.eye = new SWORD.Eye(this);
	this.hp = new SWORD.HP(spriteObject.hp, this.action[this.actionType].width, this.action[this.actionType].height);
};

SWORD.Role.prototype = Object.create(SWORD.AnimationSprite.prototype);


// 判断是否再战斗的状态
SWORD.Role.prototype.battle = function(){

	if (!this.enemy || this.cooldown > 0) return false;

	var intervals = astar.getNumberOfIntervals(this.currentGridID, this.enemy.currentGridID);

	if (intervals < this.eye.vision) {
		if (!this.action['hit'].move || !intervals && this.enemy.actionType !== 'run') {
			return true;
		}
	}
	return false;
};

SWORD.Role.prototype.updateTransform = function(){
	
	SWORD.AnimationSprite.prototype.updateTransform.call(this);

	// 如果角色没有生命值
	if (!this.hp.consume) {
		// 如果动画也播放完毕，那么就隐藏对象
		if (!this.playing) this.visible = false;
		return;
	}
	
	if (this.enemy && this.enemy.hp.consume <= 0) {
		this.enemy = null;
		this.attackStatus = false;
	}

	// 如果没有用户在操作那么执行自由寻找
	if (!this.controlled) {
		// 探测周围
		this.eye.probingAround();
	}
	
	if (this.attackStatus) {
		if (this.battle()) {
			this.actionType = 'hit';
			this.changeFace(this.currentGridID, this.enemy.currentGridID);
			this.attackStatus = true;
			return;
		}
	} else {
		var moveStatus = this.foot.updateTransform();

		if (moveStatus) {
			this.actionType = 'run';
			return;
		} else if (this.battle() && !moveStatus) {
			this.actionType = 'hit';
			this.changeFace(this.currentGridID, this.enemy.currentGridID);
			this.attackStatus = true;
			return;
		}
	}

	this.actionType = 'stand';
};