/**
 * 对象移动模块
 *
 * @param {number} dwellTime 每次移动间隔时间,帧率
 * @param {number} speed 每次移动的像素个数/移动速度
 * @param {object} currentPosition 精灵的当前坐标
 * 
 * 使用说明
 * 首先设定终点位置,循环更新数据，
 * 
 * @function changeEndPosition 设置终点位置
 * @function updateTransform 循环更新对象的位置,return Boolean - true到达终点,false正在移动未到达终点
 */

SWORD.Move = function(dwellTime, speed, currentPosition){
	
	/** 
	 * 起点移动的位置
	 */
	this.startPosition = currentPosition.clone();

	/** 
	 * 当前位置的位置
	 */
	this.currentPosition = currentPosition;
	
	/** 
	 * 终点目标的位置
	 */
	this.endPosition = currentPosition.clone();
	
	/**
	 * 每次移动多少像素
	 * @param {number} 移动速度/像素
	 */
	this.speed = speed || 3;

	/**
	 * 每次移动的时间间隔
	 * @param {number} 时间
	 */
	this.dwellTime = dwellTime || 0;

	// 时间戳-用来递减每次移动的间隔时间 - 移动速度
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

	if ( this.LongEdge === 'width' ) {
		// x
		if (this.width < 0) {
			this.currentPosition.x += this.speed;
			if (this.currentPosition.x > this.endPosition.x) this.currentPosition.x = this.endPosition.x;
		} else if (this.width > 0) {
			this.currentPosition.x -= this.speed;
			if (this.currentPosition.x < this.endPosition.x) this.currentPosition.x = this.endPosition.x;
		}

		this.currentPosition.y = ~~(0.5 + (this.height/this.width)*(this.currentPosition.x - this.startPosition.x) + this.startPosition.y);
	} else {
		// y
		if (this.height < 0) {
			this.currentPosition.y += this.speed;
			if (this.currentPosition.y > this.endPosition.y) this.currentPosition.y = this.endPosition.y;
		} else if (this.height > 0) {
			this.currentPosition.y -= this.speed;
			if (this.currentPosition.y < this.endPosition.y) this.currentPosition.y = this.endPosition.y;
		}
		this.currentPosition.x = ~~(0.5 + (this.width/this.height)*(this.currentPosition.y - this.startPosition.y) + this.startPosition.x);
	}
};

/**
 * 改变开始坐标位置
 */
SWORD.Move.prototype.changeStartPosition = function(){
	
	this.startPosition.x = this.currentPosition.x;
	this.startPosition.y = this.currentPosition.y;
	
	this.width = this.startPosition.x - this.endPosition.x;
	this.height = this.startPosition.y - this.endPosition.y;

	this.LongEdge = Math.abs(this.width) > Math.abs(this.height) ? 'width' : 'height';
};

// 改变终点位置
SWORD.Move.prototype.changeEndPosition = function(x, y){
	this.endPosition.x = x;
	this.endPosition.y = y;
	this.changeStartPosition();
};

/** 
 * 一直更新移动信息
 */
SWORD.Move.prototype.updateTransform = function(){

	// 到达终点
	if (this.currentPosition.x === this.endPosition.x && this.currentPosition.y === this.endPosition.y) {
		return true;
	}

	if (this.deltaTime <= 0) {
		this.moving();
		this.deltaTime = this.dwellTime;
	} else {
		this.deltaTime -= this.sprite.deltaTime;
	}
	return false;
};