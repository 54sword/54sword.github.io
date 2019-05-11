
/**
 * A星寻路算法
 */

SWORD.AStar = function(grid) {
	this.grid = grid;
	// 创建网格数组
	this.array = this.createGridMapArray(grid);
	// 可移动的方向，十字，顺时针
	this.direction = [-grid.row, -1, grid.row, 1];
	// 逆时针方向
	// this.reverseDirection = [1, grid.row, -1, -grid.row];
	// 数组长度
	this.directionLen = this.direction.length;
	// 搜寻状态
	this.status = false;
	// 开始位置
	this.start = -1;
	// 当前位置
	this.current = -1;
	// 结束位置
	this.end = -1;
	// 可能会被选择行走的格子
	this.open = [];
	// 已经走过或不会被选行走的格子
	this.closed = [];
	// open 缓存
	this.openCache = [];
	// 是否是十字寻路，否则是8方向寻路
	this.cross = true;
};

/**
 * 创建网格地图数组
 *
 * @method createGridMapArray
 * @expand AStar
 * @param {object} {x,y,rou,column,width,height}
 * @return {array} 返回数组，每个元素都带有相应的数组
 */

SWORD.AStar.prototype.createGridMapArray = function(grid){
	var array = [];
	for (var y = 0; y < grid.column; y++) {
		for (var x = 0; x < grid.row; x++) {
			array.push({ 
				position: new SWORD.Point(grid.x + x*grid.width, grid.y + y * grid.height),
				x: x,
				y: y,
				mark: 0,
				id: array.length,
				sprite: null
			});
		}
	}
	return array;
};

/**
 * 寻路
 * 
 * @method find
 * @param {numerb} start 起点位置
 * @param {number} end 终点位置
 * @return {array} 成功返回数组－返回的数组不包括起点位置
 *		
 */

SWORD.AStar.prototype.find = function(start, end) {
	if (end < 0 || typeof(end) === 'undefined') return false;
	if (start === end) return false;

	this.reset(start, end);
	this.probe();
	return this.status ? this.getRecentlyRoute() : false;
};

// 重置属性
SWORD.AStar.prototype.reset = function(start, end) {
	this.status = false;

	this.start = start;
	this.current = this.start;
	this.end = end;
	
	this.open.length = 0;
	this.closed.length = 0;
	this.openCache.length = 0;
	
	this.closed[this.current] = { id: this.start, f: 0, g: 0, h: 0 };
};

/**
* 获取最近的路线
*
* @expand AStar
* @method getRecentlyRoute
* @return {array} 返回可以移动的路线
*/

SWORD.AStar.prototype.getRecentlyRoute = function() {

	var that = this;
	var	route = [];
	var probe = function(g) {
		g--;

		var f, key;

		// 探测4个方向格子中最近的格子
		for ( var i = 0; i < that.directionLen; i++ ) {
			var n = that.current + that.direction[i];
			if ( that.closed[n] && that.closed[n].g && that.closed[n].g === g ) {
				if ( !f || that.closed[n].f < f ) {
					f = that.closed[n].f;
					key = n;
				}
			}
		}
		
		if ( key >= 0 ) {
			// 将元素插入到数组的头部
			route.unshift(that.array[key]);
			that.current = key;
		}

		// 继续探寻，直到g等于0
		if (g > 0) probe(g);
	};

	route.unshift(this.array[this.current]);
	probe(this.closed[this.current].g);
	return route;
};

/*
* 探测器
*
* @method probe
* @expand AStar
*
*/
SWORD.AStar.prototype.probe = function() {
	
	// 当前格子距离终点最短的行走距离，加上当前移动的步数
	var f = 0; 
	// 已经行走的步数
	var g = 0;
	// 当前格子距离终点最短的行走距离
	var h = 0;
	// 累加循环的次数
	var count = 0;
		
	// var d = this.array[this.current].x > this.array[this.end].x ? this.reverseDirection : this.direction;

	for (var i = 0; i < this.directionLen; i++) {
		
		var n = this.current + this.direction[i];
		
		// 过滤
		if (this.closed[n] || 
			!this.array[n] || 
			this.array[this.current].x !== this.array[n].x && this.array[this.current].y !== this.array[n].y) continue;
			
		// 障碍物或人物
		if (this.array[n].mark > 0) {
		// if (this.array[n].mark === 1) {
			this.closed[n] = 1;
			continue;
		}
		
		count++;
		
		h = Math.abs(this.array[this.end].x - this.array[n].x) + Math.abs(this.array[this.end].y - this.array[n].y);
		g = this.closed[this.current].g + 1;
		f = g + h;
		
		// 判断open缓存数组中是否已经存在
		if (this.openCache[n]) {
			// 如果已经存在open数组,并且f值更小，那么更新该对象
			if (f < this.openCache[n].f) {
				this.openCache[n] = { id: n, f: f, g: g, h: h };
				for (var i = 0, len = this.open.length; i < len; i++) {
					if (this.open[i].id === n) {
						this.open[i] = { id: n, f: f, g: g, h: h };
						break;
					}
				}
			}
			continue;
		}

		this.openCache[n] = { id: n, f: f };
		this.open.push({ id: n, f: f, g: g, h: h });
	}

	// 寻找出最小的f值对象
	var f = 10000, key = -1, len = this.open.length;

	if (count > 0 && len > 0) {
		for (var i = 1; i <= count; i++) {
			var n = len - i;
			if (this.open[n] && this.open[n].f < f) {
				f = this.open[n].f;
				key = n;
			}
		}
	}
	
	switch (true) {
		// 终点
		case this.current === this.end:
			this.status = true;
			return true;
		// 死胡同
		case key < 0 && this.open.length === 0:
			return false;
		// 寻找到下一步
		case key > -1:
			this.closed[this.open[key].id] = this.open[key];
			this.current = this.open[key].id;
			delete this.openCache[this.open[key].id];
			this.open.splice(key, 1);
			break;
		// 没有探寻到格子，那么就从最后一个格子开始寻路
		case key < 0:
			var last = this.open.pop();
			delete this.openCache[last.id];
			this.current = last.id;
			this.closed[this.current] = last;
			break;
	}
	this.probe();
};


/** 
 * 获取两个格子之间间隔格子数量
 *
 * @method getNumberOfIntervals
 * @expand AStar
 * @param {number} a 格子在数组的键值
 * @param {number} b 格子在数组的键值
 * @example
 *		AStar.getNumberOfIntervals(0, 10);
 * @renturn {number} 范围间隔数量
 */

SWORD.AStar.prototype.getNumberOfIntervals = function(a, b){
	return Math.abs(this.array[a].x - this.array[b].x) + Math.abs(this.array[a].y - this.array[b].y) - 1;
};

/** 
 * 在目标位置的第几环位置
 *
 * @method getNumberOfRing
 * @expand AStar
 * @param {number} a 自己的当前位置
 * @param {number} b 目标位置
 * @example
 *		AStar.getNumberOfRing(0, 10);
 * @renturn {number} 范围间隔数量
 */

SWORD.AStar.prototype.getNumberOfRing = function(a, b){
	a = Math.abs(this.array[a].x - this.array[b].x);
	b = Math.abs(this.array[a].y - this.array[b].y);
	return a >= b ? a : b;
};

/**
 * 交换格子的属性, mark and sprite
 *
 * @method exchangeGridInfo
 * @expand AStar
 * @param {number} agid 数组的键值
 * @param {number} bgid 数组的键值
 * @return null
 */

SWORD.AStar.prototype.exchangeGridInfo = function(a, b){

	var mark = this.array[a].mark;
	var sprite = this.array[a].sprite;

	this.array[a].mark = this.array[b].mark;
	this.array[a].sprite = this.array[b].sprite;
	
	this.array[b].mark = mark;
	this.array[b].sprite = sprite;
};


/**
* 获取目标格子周围指定mark值的格子
*
* @method getAroundTheGrid
* @expand AStar
* @param {number} gid 目标格子的id
* @param {number} ring 环数(以目标格子为中心,向外的环数,如果没有值传入,那么默认是1)
* @param {number} mark 对应格子的mark值(0是空,1是障碍物,2是精灵,如果没有值传入,那么默认值是0)
* @param {boolean} cross true: 4方向，false: 8方向
* @example
*		astar.getAroundTheGrid(20, 2, 0, true);
* @return {array} 返回空位置格子(mark等于0的数组)的数组,数组是以目标为中心由内向外一环一环输出,也就由近至远
*/

SWORD.AStar.prototype.getAroundTheGrid = function(gid, ring, mark, cross){

	mark = mark || 0;
	ring = ring || 1;
	
	var maxX = this.array[gid].x + ring;
	var maxY = this.array[gid].y + ring;
	var minX = this.array[gid].x - ring;
	var minY = this.array[gid].y - ring;

	var gridArray = [];
	var array = [];

	for (var i = 0; i < ring; i++) {
		array.push([]);
	}

	if (maxX > this.grid.row - 1) maxX = this.grid.row - 1;
	if (maxY > this.grid.column - 1) maxY = this.grid.column - 1;
	if (minX < 0) minX = 0;
	if (minY < 0) minY = 0;

	for (var y = minY; y <= maxY; y++) {
		for (var x = minX; x <= maxX; x++) {

			var g = x + y * this.grid.row;

			if (this.array[g].mark === mark && this.array[g].id !== gid) {

				var a = Math.abs(this.array[gid].x - this.array[g].x);
				var b = Math.abs(this.array[gid].y - this.array[g].y);
				var c = a >= b ? a : b;

				if (!cross || cross && a + b <= ring) {
					// 如果格子距离目标0距离，那么有限添加到数组的头部
					if (c === 1 && !this.getNumberOfIntervals(gid, g)) {
						array[c - 1].unshift(this.array[g]);
					} else {
						array[c - 1].push(this.array[g]);
					}
				}
			}

		}
	}
	
	for (var i = 0; i < ring; i++) {
		gridArray = gridArray.concat(array[i]);
	}

	return gridArray;
};

/**
 * 获取最接近目标的移动到的位置
 *
 * @method getRecentAttackPosition
 * @expand AStar
 * @param {number} startGid 自己位置id
 * @param {numer} targetGid 目标位置id
 * @example
 * 		this.getRecentAttackPosition(5, 0);
 * @return {object} 成功返回返回对象
 */

SWORD.AStar.prototype.getRecentClosePosition = function(startGid, targetGid) {

	// 攻击位置和路线
	var attack = {
		// 攻击位置
		position: -1,
		// 路径的长度
		routeLength: -1
	};

	var currentIntervals = this.getNumberOfIntervals(startGid, targetGid);

	// 已经站在攻击的位置
	if (currentIntervals === 0) {
		attack.position = startGid;
		attack.routeLength = 0;
		return attack;
	}

	// 获取目标格子周围空的位置
	var gridArray = this.getAroundTheGrid(targetGid, 3, 0);
	
	for (var i = 0, length = gridArray.length, route; i < length; i++) {

		// 过滤到自己的位置
		if (gridArray[i].id === startGid) continue;
		
		// 获取最短的路径
		route = this.find(startGid, gridArray[i].id);
		
		if (!route) continue;
		
		// 只要获取一次成功最近的路径，那么就不再继续探测，因为获取周围格子的时候，是按目标的最近的环数向外排列
		// 因此只要获取一次，那么就说明是最近的可以移动到的位置

		// 如果获取的最近路径小于但前位置，那么返回坐标位置
		if (this.getNumberOfIntervals(gridArray[i].id, targetGid) < currentIntervals) {
			attack.position = gridArray[i].id;
			attack.routeLength = route.length;
		}

		break;
	}
	
	// 如果最近的目标位置和当前的位置一样，那么就保持原地状态
	if (attack.position < 0 ||
		attack.position >= 0 && this.getNumberOfIntervals(gridArray[i].id, targetGid) >= currentIntervals) {
		return null;
	} else {
		return attack;
	}
};
