// 定时器
SWORD.Timer = function() {
	// 当前时间
	this.currentTick = Date.now();
	// 最近一次时间戳
	this.lastTick = this.currentTick;
	// 时间戳
	this.deltaTime = 0;
};

SWORD.Timer.prototype = {
	// 获取当前时间
	tick: function() {
		this.currentTick = Date.now();
		this.deltaTime = this.currentTick - this.lastTick;
		this.lastTick = this.currentTick;
		return this.currentTick;
	}
};