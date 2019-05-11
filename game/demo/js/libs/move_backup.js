/*
 * 对象移动模块
 *
 * @param {object} self 移动对象
 * 
 * @return {Object} 调用update更新移动位置，返回true则达到终点位置
 */

SWORD.Move = function(dwellTime, speed){

	/** 
	 * 起点移动的位置
	 */
	this.startPosition = new SWORD.Point();

	// 当前坐标
	this.currentPosition = new SWORD.Point();
	/** 
	 * 终点目标的位置
	 */
	this.endPosition = new SWORD.Point();

	/**
	 * 移动的速度
	 * @param {number} 移动速度/像素
	 */
	this.speed = speed || 3;

	/**
	 * 每次移动的间隔时间
	 * @param {number} 时间
	 */
	this.dwellTime = dwellTime || 0;

	// 时间戳-用来递减每次移动的间隔时间
	this.deltaTime = 0;

	// 起点到终点横向的距离
	this.width = 0;
	
	// 起点到终点纵向的距离
	this.height = 0;

	// 纪录width与height较长的边长，以它作为移动主轴
	// width or height
	this.LongEdge = '';
};

// 每次移动位置计算
SWORD.Move.prototype.moving = function(){

	var position = this.sprite.position;

	if ( this.LongEdge === 'width' ) {
		// x
		if (this.width < 0) {
			position.x += this.speed;
			if (position.x > this.endPosition.x) position.x = this.endPosition.x;
		} else if (this.width > 0) {
			position.x -= this.speed;
			if (position.x < this.endPosition.x) position.x = this.endPosition.x;
		}

		position.y = ~~(0.5 + (this.height/this.width)*(position.x - this.startPosition.x) + this.startPosition.y);
	} else {
		// y
		if (this.height < 0) {
			position.y += this.speed;
			if (position.y > this.endPosition.y) position.y = this.endPosition.y;
		} else if (this.height > 0) {
			position.y -= this.speed;
			if (position.y < this.endPosition.y) position.y = this.endPosition.y;
		}
		position.x = ~~(0.5 + (this.width/this.height)*(position.y - this.startPosition.y) + this.startPosition.x);
	}
};

/**
 * 改变开始坐标位置
 */
SWORD.Move.prototype.changeStartPosition = function(){

	this.startPosition.x = this.sprite.position.x;
	this.startPosition.y = this.sprite.position.y;
	
	this.width = this.startPosition.x - this.endPosition.x;
	this.height = this.startPosition.y - this.endPosition.y;

	this.LongEdge = Math.abs(this.width) > Math.abs(this.height) ? 'width' : 'height';
};

/** 
 * 一直更新移动信息
 */
SWORD.Move.prototype.updateTransform = function(){
	
	// 到达终点
	if (this.sprite.position.x === this.endPosition.x && this.sprite.position.y === this.endPosition.y) return true;

	if (this.deltaTime <= 0) {
		this.moving();
		this.deltaTime = this.dwellTime;
	} else {
		this.deltaTime -= this.sprite.deltaTime;
	}
	return false;
};