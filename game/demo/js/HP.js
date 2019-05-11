/** 角色HP **/
SWORD.HP = function(hp, width, height) {
	// 生命值消耗
	this.consume = hp;
	// 生命值缓存
	this.hpCache = hp;

	this.lifeWidth = 0;
	this.x = Math.abs(width/2) - 50;
	this.y = 0;
	this.math();
};

SWORD.HP.prototype.width = 100;
SWORD.HP.prototype.height = 5;
// 计算生命值
SWORD.HP.prototype.math = function(){
	this.lifeWidth = ~~(0.5 + (this.consume/this.hpCache) * this.width);
};
// 伤害
SWORD.HP.prototype.harm = function(consume) {
	if (this.consume > 0) {
		this.consume -= consume;
		if (this.consume < 0) {
			this.consume = 0;
			return true;
		}
		this.math();
		return false;
	} else {
		this.consume = 0;
		return true;
	}
};