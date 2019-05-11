
/**
 * 游戏的场景
 *
 * @class Scenes 游戏场景
 * @param {object} stage
 */

SWORD.Scenes = function(stage){
	this.stage = stage;
};

// game loading...
SWORD.Scenes.prototype.loading = function(imageResources){
	
	renderer.canvas.style.background = 'url(images/loading.png)';

	var images = [];
	
	for (var i in imageResources) {
		for (var n in imageResources[i]) {
			if (imageResources[i][n].img) {
				images.push(imageResources[i][n].img);
			}
		}
	}

	var loading = new SWORD.AssetLoader(images);
	loading.onProgress = function(){ console.log('Game loading...'); };
	loading.onComplete = function(){
		console.log('Game loaded complete');

		setTimeout(function(){
			scenes.index();
		}, 2000);
	};
	loading.load();
};

// game index
SWORD.Scenes.prototype.index = function(){

	var sprites = imageResources.sprites;
	
	renderer.canvas.style.background = 'url(images/other/home.jpg)';

	for (var i = 0, len = grid.array.length; i < len; i++) {
		
		var arr = grid.array[i];
		
		if ( i === 1 || i === 11 || i === 18) {
			var o = new SWORD.Role(SWORD.Texture.fromImage(sprites['lionPeople'].img), sprites['lionPeople'], i, 1);
			
			this.stage.addSprite( o );

			o.mark = 2;
			
			
			// o.alpha = 0.5;
			
			// console.log(o);
			
		// } else if ( i <= 44 && i > 23 && i !== 25 ) {
			
		} else if ( 
			// i === 1000
			i == 4 || i == 5 || i == 6 || i == 7 || i == 8 ||
			i == 12 || i == 13 || i == 14 || i == 15 || i == 16 || i == 17 ||
			i == 21 || i == 22 || i == 23 || i == 24 || i == 26 ||
			i == 30 || i == 31 || i == 32 || i == 33 || i == 34 || i == 35 ||
			i == 39 || i == 40 || i == 41 || i == 42 || i == 43 || i == 44 
		) {
			var o = new SWORD.Role(SWORD.Texture.fromImage(sprites['spider'].img), sprites['spider'], i, 2);
			o.mark = 2;				
			// var a = new SWORD.Light(imageResources.skill.light.img);
			
			// o.addChild(a);
			
			this.stage.addSprite( o );
		} else if ( i === 0) {
			var o = new SWORD.Role(SWORD.Texture.fromImage(sprites['magician'].img), sprites['magician'], i, 1);
			o.mark = 2;

			this.stage.addSprite( o );

		}


	}
};