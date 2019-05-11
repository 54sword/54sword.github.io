/*
* 监听canvas的事件
* 
* @param {object} 游戏核心对象
* @param {DOM object} canvas对象 
*/
SWORD.MouseEvents = function(element, callback) {
	// 依赖
	var browser = SWORD.Device.browser;
	var system = SWORD.Device.system;
	var deviceType = SWORD.Device.type;
	
	// 事件数组
	var events = {
		'Desktop Computer': ['click','dblclick','mousedown','mouseup','mouseover', 'mousemove',
				   'mouseout','keypress','keydown','keyup','contextmenu'],
		'Mobile device': ['touchstart', 'touchmove', 'touchend', 'orientationchange']
	};
	
	this.point = { x: 0, y: 0, type: '' };
	this.element = element;
	this.callback = callback;
	// 客户端边界
	this.bounding = element.getBoundingClientRect();

	// 按下状态
	this.mousedownStatus = false;
	
	var that = this;

	for (var i = 0, len = events[deviceType].length; i < len; i++) {
		this.addEvent(events[deviceType][i], function(ev) {
			that.events(ev);
		});
	}
};

SWORD.MouseEvents.prototype = {
	// 添加事件
	addEvent: function() {
		var fn;
		if (window.addEventListener) {
			fn = function (type, fn) {
				this.element.addEventListener(type, fn, false);
			}
		} else if (window.attachEvent) {
			fn = function (type, fn) {
				this.element.attachEvent('on'+type, fn);
			}
		}
		return fn;
	}(),
	// 事件路由器
	events: function(ev) {
		ev.preventDefault();
		switch (ev.type) {
			case 'contextmenu':
				return false;
			case 'mousedown':
				switch (ev.button) {
					// 鼠标左键
					case 0:
						this.mousedownStatus = true;
						this.mousedown(ev);
						break;
					// 滚轮
					case 1:
						break;
					// 右键
					case 2:
						break;
					default:
						return false;
				}
				break;
			case 'mouseup':
				this.mousedownStatus = false;
				this.mousedown(ev);
				break;
			case 'mousemove':
				this.mousemove(ev);
				break;
			// 移动设备
			case 'touchstart': 
				this.mousedown(ev);
				break;
			case 'orientationchange':
				this.orientationchange(ev);
		}
		this.callback();
	},
	// 鼠标按下
	mousedown: function(ev) {
		this.point.x = ev.pageX ? ev.pageX - this.bounding.left : ev.changedTouches[0].pageX - this.bounding.left;
		this.point.y = ev.pageY ? ev.pageY - this.bounding.top : ev.changedTouches[0].pageY - this.bounding.top;
		this.point.type = ev.type;
	},
	// 鼠标移动
	mousemove: function(ev) {
		this.point.x = ev.pageX - this.bounding.left;
		this.point.y = ev.pageY - this.bounding.top;
		this.point.type = ev.type;
	},
	// 翻转
	orientationchange: function(ev) {
		switch (window.orientation) {
			case -90 :
			case 90 :
				// var viewport = document.getElementById('viewport');
				// viewport.content = 'width=device-width,initial-scale=0.3';
				// alert('横屏');
					/*
					window.document.body.style.width = "960px";
					window.document.body.style.height = "768px";
					window.document.body.style.margin = "0px";
					window.document.body.style.padding = "0px";
					window.document.body.style.backgroundColor = "#345667";
					*/
				break;
			default :
				//alert('请旋转置横屏');
		}
	}
};