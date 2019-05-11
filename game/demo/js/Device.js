/**
 * 设备相关的一些信息
 */

SWORD.Device = (new function(window) {
	
	var userAgent = window.navigator.userAgent || navigator.userAgent;
	var	that = this;
	var	browsers = ['Chrome', 'Opera', 'MSIE', 'Firefox', 'Safari'];
	var	systems = {
			mobiles: ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'],
			computers: ['Windows', 'Mac']
		};
	var resize = function() {
			that.screenHeight = document.documentElement.clientHeight;
			that.screenWidth = document.documentElement.clientWidth;
		};
		
	// 所有对象属性都在变量之后

	// 屏幕尺寸
	this.screenHeight = 0;
	this.screenWidth = 0;
	resize();
	// 监听窗体尺寸变化，实时同步尺寸大小
	window.onresize = resize;

	// 设备类型
	this.type = 'Unknown Device type';

	// 系统
	this.system = (function() {
		for (var i = 0, len = systems.mobiles.length; i < len; i++) {
			if (userAgent.indexOf(systems.mobiles[i]) !== -1) {
				that.type = 'Mobile device';
				return systems.mobiles[i];
			}
		}

		for (var i = 0, len = systems.computers.length; i < len; i++) {
			if (userAgent.indexOf(systems.computers[i]) !== -1) {
				that.type = 'Desktop Computer';
				return systems.computers[i];
			}
		}
		return 'Unknown System';
	}());

	// 浏览器
	this.browser = (function() {
		for (var i = 0, len = browsers.length; i < len; i++) {
			if (userAgent.indexOf(browsers[i]) !== -1) return browsers[i];
		}
		return 'Unknown Browser';
	}());

	SWORD.log('Device: '+ this.type +' -> '+this.system+' -> '+this.browser);
	
}(window));