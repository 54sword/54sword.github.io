// 一些数学计算

SWORD.Math = {};

SWORD.Math.Ponit = function(x, y){
	this.x = x || 0;
	this.y = y || 0;
};

SWORD.Math.Rectangle = function(x, y, width, height){
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
};

/**
 * 获取指定范围的随机数(支持负数)
 *
 * @module getRandomNumber
 * @param {Number} n 最小值
 * @param {Number} m 最大值
 * @return {Number} 返回n与m之间的随机数
 */
SWORD.Math.randomNumber = function(n, m) {
	return Math.round(Math.random()*(n-m)+m);
};

/**
 * 获取两点之间最短的距离
 * 勾股定理
 *
 * @param  {Object} obj1 点
 * @param  {Object} obj2 点
 * @return {int} 返回正整数
 */
SWORD.Math.distance = function (obj1, obj2) {
	var x = obj1.x - obj2.x;
	var y = obj1.y - obj2.y;
	return Math.sqrt(x*x + y*y);
};

/**
 * 判断点是否在矩形内部
 *
 * @param  {Object}  点
 * @param  {Object}  矩形
 * @return {Boolean} 返回布尔值
 */
SWORD.Math.pointInRect = function(a, b) {
	return a.x > b.x && a.y > b.y && a.x < b.x + b.width && a.y < b.y + b.height;
};

/**
 * 检测点是否在椭圆内部
 *
 * @param   {Number}  检测点的x坐标
 * @param   {Number}  检测点的y坐标
 * @param   {Number}  长半轴
 * @param   {Number}  短半轴
 * @return  {Boolean} 返回点是否在椭圆上及内部
 */
SWORD.Math.pointInEllipse = function(px, py, pw, ph) {
	px = ~~(0.5 + Math.abs(px));
	py = ~~(0.5 + Math.abs(py));
	pw = ~~(0.5 + Math.abs(pw));
	ph = ~~(0.5 + Math.abs(ph));
	if (px > pw || py > ph) {
		return false;
	}
	if ( ((px / pw) * (px / pw) + (py / ph) * (py / ph)) <= 1 ) {
		return true;
	}
};

/**
 * 检测矩形是否与椭圆碰撞
 *
 * @param  {Object}  矩形
 * @param  {Object}  矩形(椭圆的中心点)
 * @return {Boolean} 返回布尔值
 */
SWORD.Math.rectInEllipse = function(obj1, obj2) {

	// 椭圆
	var ellipses = {
		x: obj2.x + obj2.body.w/2,
		y: obj2.y + obj2.body.h - obj2.offset.y,
		a: obj2.range.a,		//长半轴
		b: obj2.range.b 		//短半轴
	};

	var ltx = obj1.x + obj1.offset.x - ellipses.x;				 // 左上角的点
	var rtx = obj1.x + obj1.body.w - obj1.offset.x - ellipses.x; // 右上角的点
	var ldy = obj1.y + obj1.offset.y - ellipses.y;				 // 左下角的点
	var rdy = obj1.y + obj1.body.h - obj1.offset.y - ellipses.y; // 右下角的点
	var cx = obj1.x + obj1.body.w/2 - ellipses.x; 				 // 横向的中心点
	var cy = obj1.y + obj1.body.h/2 - ellipses.y; 				 // 纵向的中心点
	
	switch (true) {
		case SWORD.Math.pointInEllipse(ltx, ldy, ellipses.a, ellipses.b): break;	// 左上
		case SWORD.Math.pointInEllipse(rtx, ldy, ellipses.a, ellipses.b): break;	// 右上
		case SWORD.Math.pointInEllipse(ltx, rdy, ellipses.a, ellipses.b): break;	// 左下
		case SWORD.Math.pointInEllipse(rtx, rdy, ellipses.a, ellipses.b): break;	// 右下
		case SWORD.Math.pointInEllipse(cx,  ldy, ellipses.a, ellipses.b): break;	// 上中
		case SWORD.Math.pointInEllipse(cx,  rdy, ellipses.a, ellipses.b): break;	// 下中
		case SWORD.Math.pointInEllipse(ltx,  cy, ellipses.a, ellipses.b): break;	// 左中
		case SWORD.Math.pointInEllipse(rtx,  cy, ellipses.a, ellipses.b): break;	// 右中
		default:
			return false;
	}
	return true;
};

/**
 * 判断矩形与圆相交
 *
 * @param  {Object}  矩形
 * @param  {Object}  正圆
 * @return {Boolean} 返回布尔值
 */
SWORD.Math.rectInCircle = function(rect, circle) {
	// 圆心点是否在矩形内部
	if ( SWORD.Math.pointInRect(circle, rect) ) {
		return true;
	}
	// 获取矩形的4个坐标
	var x1 = rect.x;
	var	y1 = rect.y;
	var	x2 = rect.x + rect.width;
	var	y2 = rect.y + rect.height;
	// 计算矩形4个点与圆点最短的距离
	switch (true) {
		case Math.sqrt(Math.pow(x1-circle.x,2)+Math.pow(y1-circle.y,2)) < circle.radius: break;
		case Math.sqrt(Math.pow(x1-circle.x,2)+Math.pow(y2-circle.y,2)) < circle.radius: break;
		case Math.sqrt(Math.pow(x2-circle.x,2)+Math.pow(y2-circle.y,2)) < circle.radius: break;
		case Math.sqrt(Math.pow(x2-circle.x,2)+Math.pow(y1-circle.y,2)) < circle.radius: break;
		default:
			return false;
	}
	return true;
};

/**
* 获得两个点的角度,图片上默认角度为向右(→)
*
* @param {Object} 点1的坐标
* @param {Object} 点2的坐标
* @return {Number} 角度
**/
SWORD.Math.angle = function(obj1, obj2) {
	var z = Math.abs(obj1.x - obj2.x),
		b = Math.abs(obj1.y - obj2.y),
		c = Math.sqrt(Math.pow(z, 2) + Math.pow(b, 2)),
		cos = b/c,                                      // 余弦
		radina = Math.acos(cos),                        // 弧度
		angle = ~~(0.5 + 180/(Math.PI/radina));         // 角度

	switch (true) {
		case obj1.x  <  obj2.x && obj1.y > obj2.y : angle = angle - 90;    break; // ↗
		case obj1.x  <  obj2.x && obj1.y < obj2.y : angle = 90 - angle;    break; // ↘
		case obj1.x  >  obj2.x && obj1.y > obj2.y : angle = -(angle + 90); break; // ↖
		case obj1.x  >  obj2.x && obj1.y < obj2.y : angle = angle + 90;    break; // ↙
		case obj1.y === obj2.y && obj1.x > obj2.x : angle = 180;           break; // ←
		case obj1.y === obj2.y && obj1.x < obj2.x : angle = 0;             break; // →
		case obj1.x === obj2.x && obj1.y < obj2.y : angle = 90;            break; // ↓
		case obj1.x === obj2.x && obj1.y > obj2.y : angle = -90;           break; // ↑
	}
	return angle;
};