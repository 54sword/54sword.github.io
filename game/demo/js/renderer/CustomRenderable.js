
// 自定义渲染

SWORD.CustomRenderable = function(){
	SWORD.DisplayObject.call( this );
}

SWORD.CustomRenderable.constructor = SWORD.CustomRenderable;
SWORD.CustomRenderable.prototype = Object.create( SWORD.DisplayObject.prototype );

SWORD.CustomRenderable.prototype.renderCanvas = function(renderer){

}
