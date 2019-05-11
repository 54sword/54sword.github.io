
// 精灵的脚
// 监听sprite.movetogrid的变化，如果发生变化，则会自动开始寻找移动路线
SWORD.Foot = function(sprite){
	
	// 将sprite
	SWORD.Move.call(this, sprite.moveDwellTime, 4, sprite.position);
	
	this.sprite = sprite;
	
	// 精灵与终点坐标的偏移位置，也就是精灵中心脚的位置
	// [只读]
	this.offset = {
		top: grid.height - (sprite.action[sprite.actionType].height - sprite.offset.down + 10),
		left: (grid.width - grid.width/2) - sprite.action[sprite.actionType].width/2
	};
	
	/**
	* 终点位置，目标位置
	*/
	this.end = sprite.currentGridID;
	this.endCache = sprite.currentGridID;

	/**
	 * 当前位置上次的位置记录
	 */
	this.currentCache = this.sprite.currentGridID;

	// 最短路径
	this.route = [];
	
	// 初始化开始的坐标位置
	this.setPostion(this.end);
	// 初始化在网格的信息
	grid.array[sprite.currentGridID].sprite = this.sprite;
	grid.array[sprite.currentGridID].mark = 2;

	// 初始化角色在网格地图的信息
	this.changeGridPosition(this.end);
};

SWORD.Foot.prototype = Object.create(SWORD.Move.prototype);

// 设置坐标位置
SWORD.Foot.prototype.setPostion = function(gid){
	this.sprite.position.x = grid.array[gid].position.x + this.offset.left;
	this.sprite.position.y = grid.array[gid].position.y + this.offset.top;
};

// 改变在网格的位置
SWORD.Foot.prototype.changeGridPosition =  function(gid){
	this.changeEndPosition(grid.array[gid].position.x + this.offset.left, grid.array[gid].position.y + this.offset.top);
	this.sprite.changeFace(this.sprite.currentGridID, gid);
	astar.exchangeGridInfo(this.sprite.currentGridID, gid);
	this.sprite.currentGridID = gid;
};

// 监听总店位置是否发生变化
SWORD.Foot.prototype.change = function(){
	this.endCache = this.end;
	this.route.length = 0;
};

// 更新数据
// 如果返回是true,那么说明正在移动
// 如果返回是false,那么说明没有路线或已经移动完成
SWORD.Foot.prototype.updateTransform = function(){

	var mark = false;
	// 监听终点坐标是否发生变化
	if (this.end !== this.endCache) {
		mark = true;
		this.change();
	// 更新脚步，走完一个格子，返回ture, 否者返回false
	} else if (!SWORD.Move.prototype.updateTransform.call(this)) {
		return true;
	}
	
	if (!mark) this.currentCache = this.sprite.currentGridID;
	
	// 已经在终点位置
	if ( this.sprite.currentGridID === this.end ) {
		this.sprite.controlled = false;
		return false;
	}
	
	// 如果没有路径则重新开始寻找
	if (this.route.length === 0) {
		
		// 如果主动发生位置变化，选择距离终点位置较近的位置，开始A星寻路，并且将较近的位置格子，添加到路径的头部
		// 这里有一小点复杂，慎重修改
		if (mark) {
			var start = astar.getNumberOfIntervals(this.sprite.currentGridID, this.end) <= astar.getNumberOfIntervals(this.currentCache, this.end) ? 
						this.sprite.currentGridID :
						this.currentCache;

			var route = astar.find(start, this.end);
			
			if (route) {
				route.unshift(this.sprite.grid[start]);
			}
		// 非主动位置发生变化
		} else {
			var route = astar.find(this.sprite.currentGridID, this.end);
		}
		
		// 如果有行走的路径，那么更新一下
		if (route) {
			this.route = route;
		} else {
			// 如果是用户指定位置，但无法达到的话，那么取消控制
			this.sprite.controlled = false;
			return false;
		}
	}
	
	// 判断路线是否可以通行
	if (this.sprite.grid[this.route[0].id].mark === 0) {
		this.changeGridPosition(this.route.shift().id);
		return true;
	} else {
		this.route.length = 0;
		return false;
	}
};
