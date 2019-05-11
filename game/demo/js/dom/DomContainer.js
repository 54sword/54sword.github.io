
/*
* 游戏的Dom容器,所有游戏元素都放置再该容器内部
* @class DomContainer
* @param {object} document
*/

SWORD.DomContainer = function(width, height){
	this.canvas = document.createElement('canvas');
	this.container = document.createElement('div');
	this.container.setAttribute('style',
		'width:'+width+'px;'+
		'height:'+height+'px;'+
		'background:#000;'+
		'margin:0 auto;'
	);
	this.layer = document.createElement('div');
	this.layer.setAttribute('style',
		'width:'+width+'px;'+
		'height:'+height+'px;'+
		'position: absolute; z-index:1000;'
	);

	this.container.appendChild(this.layer);

	document.body.appendChild(this.container);
};