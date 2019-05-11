SWORD.CanvasRenderer = function(width, height) {
	this.width = width || 800;
	this.height = height || 600;
	this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.count = 0;
	this.context = this.canvas.getContext('2d');

	this.canvas.setAttribute('style','position:absolute; z-index:0;');
	
	// 45度视角
	// this.context.setTransform(1, 0.5, -1, 0.5, 480, 0);
};

SWORD.CanvasRenderer.prototype = {
	clear: function() {
		this.context.clearRect(0, 0, this.width, this.height);
	},
	hp: function(sprite) {
		
		if (sprite.hp.consume === sprite.hp.hpCache || sprite.actionType == "death") return;
		
		this.context.save();
		this.context.fillStyle = '#000';
		this.context.fillRect(sprite.position.x + sprite.hp.x, sprite.position.y + sprite.hp.y, sprite.hp.width, sprite.hp.height);
		this.context.fillStyle = '#00b400';
		this.context.fillRect(sprite.position.x + sprite.hp.x, sprite.position.y + sprite.hp.y, sprite.hp.lifeWidth, sprite.hp.height);
		this.context.restore();
	},
	
	line: function(point, setting) {

		this.context.strokeStyle = setting && setting.color ? setting.color : '#000';
		this.context.lineWidth = setting && setting.lineWidth ? setting.lineWidth : 1;
		this.context.beginPath();
		
		this.context.moveTo(point[0].x + 0.5, point[0].y + 0.5);
		
		for (var i = 1, max = point.length; i < max; i++) {
			this.context.lineTo(point[i].x + 0.5, point[i].y + 0.5);
		}
		
		this.context.closePath();
		this.context.stroke();
	},

	grid: function(grid) {
		
		this.line([
			{ x: grid.x,  y: grid.y },
			{ x: grid.x + grid.row * grid.width - 1, y: grid.y },
			{ x: grid.x + grid.row * grid.width - 1, y: grid.y + grid.column * grid.height - 1 },
			{ x: grid.x, y: grid.y + grid.column * grid.height - 1 },
			{ x: grid.x,  y: grid.y }
		]);
		
		for (var i = 1, max = grid.column; i < max; i++) {
			this.line([
				{ x: grid.x,  y: grid.y + grid.height * i },
				{ x: grid.x + grid.row * grid.width - 1, y: grid.y + grid.height * i }
			]);
		}

		for (var i = 1, max = grid.row; i < max; i++) {
			this.line([
				{ x: grid.x + grid.width * i,  y: grid.y },
				{ x: grid.x + grid.width * i, y: grid.y + grid.column * grid.height - 1 }
			]);
		}

		this.context.save();
		this.context.font = "italic 20px serif";
		this.context.fillStyle = "#000000";
		this.context.globalAlpha = '0.7';

		for (var n = 0, len = grid.array.length; n < len; n++) {
			var obj = grid.array[n];
			
			if (obj.mark > 0) {
				this.context.fillRect(grid.x + obj.x*grid.width, grid.y + obj.y*grid.height, 100, 100);
			}
			
			this.context.fillText(n, grid.x + obj.x*grid.width+grid.width/2, grid.y + obj.y*grid.height+grid.height/2);

			if (obj.sprite) {
				this.context.fillStyle = "#ffb400";
				this.context.fillText(obj.sprite.id, grid.x + obj.x*grid.width+grid.width - 12, grid.y + obj.y*grid.height+grid.height - 12);
				this.context.fillStyle = "#000000";
			}
		}
		this.context.restore();
	},

	focusSprite: function(sprite) {
		this.context.save();
		this.context.fillStyle = "#FF7301";
		
		this.context.fillRect(grid.x + grid.array[sprite.currentGridID].x*grid.width, grid.y + grid.array[sprite.currentGridID].y*grid.height, 100, 100);
		//this.context.fillRect(sprite.x + sprite.offset.left, sprite.y + Math.abs(100 - sprite.body.action[sprite.body.type].height), 100, 100);
		this.context.restore();
	},
	
	displayBorder: function(sprite) {

		this.context.save();
		this.context.fillStyle = "#54ff00";

		this.context.fillRect(sprite.position.x + sprite.offset.left, sprite.position.y + sprite.offset.up, 1, sprite.body.height - sprite.offset.up - sprite.offset.down);
		this.context.fillRect(sprite.position.x + sprite.offset.left, sprite.position.y + sprite.offset.up, sprite.body.width - sprite.offset.left - sprite.offset.right, 1);
		this.context.fillRect(sprite.position.x + sprite.offset.left, sprite.position.y+sprite.body.height- sprite.offset.down, sprite.body.width - sprite.offset.left - sprite.offset.right, 1);
		this.context.fillRect(sprite.position.x + sprite.body.width- sprite.offset.right, sprite.position.y + sprite.offset.up, 1, sprite.body.height - sprite.offset.up - sprite.offset.down);
		
		this.context.restore();
	},
	
	displayObject: function(displayObject) {
		
		if (!displayObject.visible || !displayObject.renderable) return;
		
		this.context.globalAlpha = displayObject.alpha;

		if (displayObject instanceof SWORD.Role) {

			if (!displayObject.texture.frame.width && !displayObject.texture.frame.height) return;
			/*
			this.line([
				{ x: displayObject.position.x,  y: displayObject.position.y },
				{ x: displayObject.position.x + displayObject.texture.frame.width, y: displayObject.position.y },
				{ x: displayObject.position.x + displayObject.texture.frame.width, y: displayObject.position.y + displayObject.texture.frame.height },
				{ x: displayObject.position.x, y: displayObject.position.y + displayObject.texture.frame.height }
			], { color: '#fff', lineWidth: 1 });
			*/
			
			// this.line([
			// 	{ x: displayObject.position.x + displayObject.offset.left,  y: displayObject.position.y + displayObject.offset.up },
			// 	{ x: displayObject.position.x + displayObject.texture.frame.width - displayObject.offset.right, y: displayObject.position.y + displayObject.offset.up },
			// 	{ x: displayObject.position.x + displayObject.texture.frame.width - displayObject.offset.right, y: displayObject.position.y + displayObject.texture.frame.height - displayObject.offset.down },
			// 	{ x: displayObject.position.x + displayObject.offset.left, y: displayObject.position.y + displayObject.texture.frame.height - displayObject.offset.down }
			// ], { color: '#fff', lineWidth: 1 });
			
			if (displayObject.face === 'left') {
				this.context.translate(this.width, 0);
				this.context.scale(-1, 1);
			}
			
			var	x = displayObject.face === 'left' ? this.width - displayObject.texture.frame.width - displayObject.position.x : displayObject.position.x;
			var	y = displayObject.position.y;
			
			this.context.drawImage(
				displayObject.texture.baseTexture.source,	// 原图
				displayObject.texture.frame.x, 				// 在图片上的坐标x
				displayObject.texture.frame.y, 				// 在图片上的坐标y
				displayObject.texture.frame.width, 			// 显示图片的宽度
				displayObject.texture.frame.height,			// 显示图片的高度
				x - (displayObject.texture.frame.width*displayObject.scale.x - displayObject.texture.frame.width)/2,// 显示图片的坐标x
				y - (displayObject.texture.frame.height*displayObject.scale.y - displayObject.texture.frame.height),											// 显示图片的坐标y
				displayObject.texture.frame.width*displayObject.scale.x,
				displayObject.texture.frame.height*displayObject.scale.y
			);
			
			if (displayObject.face === 'left') {
				this.context.translate(this.width, 0);
				this.context.scale(-1, 1);
			}
			
		} else if (displayObject instanceof SWORD._Sprite) {
			
			this.context.drawImage(
				displayObject.texture.baseTexture.source,	// 原图
				displayObject.texture.frame.x, 				// 在图片上的坐标x
				displayObject.texture.frame.y, 				// 在图片上的坐标y
				displayObject.texture.frame.width, 			// 显示图片的宽度
				displayObject.texture.frame.height,			// 显示图片的高度
				displayObject.position.x,					// 显示图片的坐标x
				displayObject.position.y,					// 显示图片的坐标y
				displayObject.texture.frame.width,
				displayObject.texture.frame.height
			);
		} else if (displayObject instanceof PIXI.CustomRenderable) {
			displayObject.renderCanvas(this);
		}

		this.context.globalAlpha = 1;
	},
	// 显示精灵数据
	showInfo: function(sprite) {
		
		var str = sprite.team+"|"+sprite.foot.end + "|" + sprite.id;
		if (sprite.enemy) str += "|" +sprite.enemy.id;
		
		this.context.save();
		this.context.font = '16pt';
		this.context.fillStyle = '#ffffff';
		this.context.textAlign = 'center';
		this.context.fillText(str, sprite.position.x+sprite.body.width/2, sprite.position.y);
		this.context.restore();
	},
	render: function(stage) {
		
		stage.updateTransform();
		
		this.clear();
		
		// this.grid(grid);
		
		// 渲染精灵
		for (var i = 0, max = stage.sprites.length; i < max; i++) {
			this.displayObject(stage.sprites[i]);
			if (stage.sprites[i].hp) this.hp(stage.sprites[i]);
			//this.showInfo(stage.sprites[i]);
			for (var n=0; n < stage.sprites[i].children.length; n++) {
			  	this.displayObject(stage.sprites[i].children[n]);
			};	
		}
		
	}
};