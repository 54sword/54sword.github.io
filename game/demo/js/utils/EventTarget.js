
/**
 * Event Target
 * @class EventTarget
 */

SWORD.EventTarget = function(){

	var listeners = {};

	this.addEventListener = function(type, listener){
		if (listeners[type] === undefined) {
			listeners[type] = [];
		}
		if (listeners[type].indexOf(listener) === -1) {
			listeners[type].push(listener);
		}
	};

	this.dispatchEvent = function(event){
		for (var listener in listeners[event.type]) {
			if ( typeof listeners[event.type][listener] === 'function' ) {
				listeners[event.type][listener](event);
			}
		}
	};
	
	this.removeEventListener = function(type, listener){
		var index = listeners[type].indexOf(listener);
		delete listeners[type][index];
	};
};