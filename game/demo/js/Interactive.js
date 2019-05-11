// 用户的操作
SWORD.interactive = function(stage) {
	var that = this;
	this.stage = stage;
	this.mouse = new SWORD.MouseEvents(DomGame.container, function(){ that.find(); });
	this.grid = grid;
	// 地区所在区域
	this.mapArea = {
		left: this.grid.x,
		top: this.grid.y,
		right: this.grid.x + this.grid.row * this.grid.width,
		bottom: this.grid.y + this.grid.column * this.grid.height
	};
};

SWORD.interactive.prototype = {
	find: function() {
		if (this.mouse.point.type === 'touchstart' ||
			this.mouse.point.type === 'mouseup'
		){
			this.map();
		}
	},
	map: function() {

		// 过滤鼠标不再地图区域的点击
		if ( this.mouse.point.x < this.mapArea.left ||
			 this.mouse.point.y < this.mapArea.top 	||
			 this.mouse.point.x > this.mapArea.right||
			 this.mouse.point.y > this.mapArea.bottom
		){
			return false;
		}
		
		var grid = this.grid;
		var x = (this.mouse.point.x - grid.x)/grid.width;
		var y = (this.mouse.point.y - grid.y)/grid.height;
		
		x = x > 1 ? parseInt(x) : 0;
		y = y > 1 ? parseInt(y) : 0;
		
		key = x + (grid.row*y);
		
		if (grid.array[key].sprite) {
			// console.log(key);
			this.stage.focusSpriteId = grid.array[key].sprite.id;
		} else if (this.stage.focusSpriteId && grid.array[key].mark === 0) {
			for (var i = 0, max = this.stage.sprites.length; i < max; i++) {
				if (this.stage.focusSpriteId === this.stage.sprites[i].id) {
					// this.stage.sprites[i].foot.change(key);
					this.stage.sprites[i].foot.end = key;	
					this.stage.sprites[i].attackStatus = false;
					this.stage.sprites[i].controlled = true;
					this.stage.sprites[i].foot.moveStatus = false;
					break;
				}
			}
		}
	}
};