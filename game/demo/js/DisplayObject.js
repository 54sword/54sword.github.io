SWORD.DisplayObject = function() {
	// 显示位置
	this.position = new SWORD.Point();
	// 比列
	this.scale = new SWORD.Point(1, 1);
	// 自转
	this.rotation = 0;
	// 透明度
	this.alpha = 1;
	// 是否可见
	this.visible = true;
	// 父
	this.parent = null;
	// 舞台
	this.stage = null;
	// 触碰区域
	this.hitArea = null;
	// 世界透明度
	this.worldAlpha = 1;
};

SWORD.DisplayObject.prototype.updateTransform = function(){
};