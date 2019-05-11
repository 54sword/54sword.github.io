/**
 * 用于显示游戏中每秒钟的帧率
 */
SWORD.FPS = function() {
	this.div = document.createElement("div");
	this.div.setAttribute(
		'style',
		'color:#fff;' +
		'background:rgba(0,0,0,0.8);' +
		'font-size:20px;' +
		'padding:5px;' +
		'width:100px;' +
		'font-family:' +
		'Avenir,Tahoma,Arial;'
	);
	DomGame.layer.appendChild(this.div);

	this.frameCount = 0;
	this.time = 0;
};

SWORD.FPS.prototype.renewFPS = function(){
	this.div.innerHTML = 'FPS:' + this.frameCount;
	this.frameCount = 0;
};

SWORD.FPS.prototype.updateTransform = function(){
	this.frameCount++;
	var time = Date.now();
	if (time - this.time > 1000) {
		this.time = time;
		this.renewFPS();
	}
};

SWORD.ShowSelectSprite = function() {
	this.div = document.createElement("div");
	this.div.setAttribute(
		'style',
		'color:#fff;' +
		'margin-top:570px;'+
		'background:rgba(0,0,0,0.8);' +
		'font-size:20px;' +
		'width:100%;'+
		'text-align:center;'+
		'height:40px;' +
		'line-height:40px;'+
		'font-family:' +
		'Avenir,Tahoma,Arial;'
	);
	DomGame.layer.appendChild(this.div);
	this.string = '';
};

SWORD.ShowSelectSprite.prototype.updateTransform = function(o){

	var str = [];
	for (var i = 0; i < o.foot.route.length; i++) {
		str.push(o.foot.route[i].id);
	}
	
	this.string = 'ID: '+ o.id +
				  ' HP: '+ o.hp.consume +'/'+ o.hp.hpCache +
				  // ' 攻击力:' + o.action['hit'].attackForce.min + ' - ' + o.action['hit'].attackForce.max +
				  ' 攻击状态: ' + o.attackStatus +
				  ' 目标位置: ' + o.foot.end +
				  ' 路径:' + str.toString();

	if (o.enemy) {
		this.string += ' 敌人:' + o.enemy.id;
	}
	
	this.div.innerHTML = this.string;
};

// 游戏播放和暂停按钮
// 暂停
SWORD.Play = function() {
	this.div = document.createElement("div");
	this.div.setAttribute(
		'style',
		'float:right; padding:20px; font-size:20px; color:#fff;' +
		'background:rgba(0,0,0,0.8);'
	);
	this.div.innerHTML = 'stop';

	var that = this;

	var fn = function(){
		if (GameStatus) {
			GameStatus = false;
			that.div.innerHTML = 'play';
		} else {
			GameStatus = true;
			requestAnimationFrame(animate);
			that.div.innerHTML = 'stop';
		}
	};
this.div.onclick = fn;

	if (window.addEventListener) {
		this.div.addEventListener('touchend', fn, false);
	} else if (window.attachEvent) {
		this.div.attachEvent('ontouchend', fn);
	}
	DomGame.layer.appendChild(this.div);
};







