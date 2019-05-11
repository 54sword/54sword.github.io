"use strict";
/**
*	门的过场动画
*	初始化即使用
**/
var door = {
	moveSpeed: 0,
	callback: null,
	img: 'images/other/door.png',
	doorLeft: {
		x: -480, y: 0,
		body:{ w: 480, h: 640, x: 0, y: 0 }
	},
	doorRight: {
		x: 960, y: 0,
		body:{ w: 480, h: 640, x: 480, y: 0 }
	},
	runMark: false,	// 运行状态标记
	/**
	* 创建并初始化过度动画
	* 
	* obj 包含如下三个函数
	* @param {function} add 添加到主循环数组
	* @param {function} remove 从主循环数组中删除自己
	* @param {function} callback 过度动画中，回调执行的函数
	**/
	create: function(obj) {
		if (this.runMark === true) return;
		this.runMark = true;
		this.remove = obj.remove;
		this.callback = obj.callback;
		this.doorLeft.x = -480;
		this.doorRight.x = 960;
		this.moveSpeed = 30;
		obj.add(this);
	},
	update: function() {
		if (this.moveSpeed > 0) {
			if (this.doorLeft.x >= 0 && this.doorRight.x <= 480) {
				if (this.status) return;
				this.status = true;
				var that = this;
				setTimeout(function(){
					that.callback();
					that.moveSpeed = -that.moveSpeed; 
				}, 1000);
			} else {
				this.doorLeft.x = this.doorLeft.x + this.moveSpeed;
				this.doorRight.x = this.doorRight.x - this.moveSpeed;
			}
		} else if (this.moveSpeed < 0) {
			if (this.doorLeft.x <= -480 && this.doorRight.x >= 960) {
				this.status = false;
				this.runMark = false;
				this.remove(this);
			} else {
				this.doorLeft.x = this.doorLeft.x + this.moveSpeed;
				this.doorRight.x = this.doorRight.x - this.moveSpeed;
			}
		}
	},
	draw: function() {
		this.ctx.drawImage(
			this.img,
			this.doorLeft.body.x,
			this.doorLeft.body.y,
			this.doorLeft.body.w,
			this.doorLeft.body.h,
			this.doorLeft.x,
			this.doorLeft.y,
			this.doorLeft.body.w,
			this.doorLeft.body.h
		);
		this.ctx.drawImage(
			this.img,
			this.doorRight.body.x,
			this.doorRight.body.y,
			this.doorRight.body.w,
			this.doorRight.body.h,
			this.doorRight.x,
			this.doorRight.y,
			this.doorRight.body.w,
			this.doorRight.body.h
		);
	}
};