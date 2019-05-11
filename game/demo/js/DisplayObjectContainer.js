// 显示对象的容器
SWORD.DisplayObjectContainer = function(){
	SWORD.DisplayObject.call(this);
	this.children = [];
	this.renderable = false;
};

SWORD.DisplayObjectContainer.prototype = Object.create(SWORD.DisplayObject.prototype);

SWORD.DisplayObjectContainer.prototype.addChild = function(child){
	if (child.parent != undefined) {
		child.parent.removeChild(child);
	}
	child.parent = this;
	this.children.push(child);
};

SWORD.DisplayObjectContainer.prototype.removeChild = function(child) {
	var index = this.children.indexOf( child );
	if ( index !== -1 )  {
		child.parent = undefined;
		this.children.splice( index, 1 );
	} else {
		throw new Error(child + " The supplied DisplayObject must be a child of the caller " + this);
	}
};

SWORD.DisplayObjectContainer.prototype.updateTransform = function() {
	
	if (!this.visible) return;
	
	SWORD.DisplayObject.prototype.updateTransform.call( this );
	
	for (var i = 0, j = this.children.length; i < j; i++) {
		this.children[i].updateTransform();
	}
}