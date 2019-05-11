
/**
 * 眼睛／精灵的视野范围
 *
 * @constructor Eye
 * @param {object} sprite
 */

SWORD.Eye = function(sprite) {
	this.sprite = sprite;
	this.vision = sprite.vision;
};

// 探测周围
SWORD.Eye.prototype.probingAround = function() {

	var self = this.sprite;
	// 敌人
	var enemy = null;
	// 目的地
	var destination = {
		position: -1,
		routeLength: -1
	};
	
	// 是否在攻击的位置
	var attackStatus = this.attack();
	
	// 获取视野范围格子,makr等于2的格子
	var spriteArray = astar.getAroundTheGrid(self.currentGridID, this.vision, 2, true);

	for (var i = 0, length = spriteArray.length; i < length; i++) {

		var sprite = spriteArray[i].sprite;
		
		// 对象已经死亡
		if (sprite.actionType === 'death') continue;
		
		// 队友
		if (self.team === sprite.team) {
			if (self.enemy && !sprite.attackStatus) {
				if (!sprite.enemy) {
					sprite.enemy = self.enemy;
				} else if (sprite.enemy && sprite.enemy.id !== self.enemy.id) {

					// 获取队友的敌人的攻击位置
					var a = astar.getRecentClosePosition(sprite.currentGridID, sprite.enemy.currentGridID);
					var b = astar.getRecentClosePosition(sprite.currentGridID, self.enemy.currentGridID);
					
					if (a && b) {
						if (b.routeLength < a.routeLength) {
							sprite.enemy = self.enemy;
						}
					} else if (b) {
						sprite.enemy = self.enemy;							
					}
				}
			}
		// 敌人
		} else if (!attackStatus) {
			
			// 获取目标最近的可移动到的位置
			var _destination = astar.getRecentClosePosition(self.currentGridID, sprite.currentGridID);
			
			if (_destination) {
				
				if (_destination.routeLength < destination.routeLength ||
					_destination.routeLength === destination.routeLength && sprite.attackStatus && _destination.routeLength === 0 ||
					destination.routeLength === -1
				) {
					enemy = sprite;
					destination = _destination;
					break;
				}
			}
		}
	}
	
	if (attackStatus) return;
		
	// 如果有发现敌人，那么移动
	if (enemy) {
		self.enemy = enemy;
		self.foot.end = destination.position;
	} else if (self.enemy) {
		
		if (self.foot.route.length) {
			return;
		}

		// 如果敌人不再视野范围，那么也需要靠近敌人
		var d = astar.getRecentClosePosition(self.currentGridID, self.enemy.currentGridID);
		if (d && d.position !== self.currentGridID) {
			destination.position = d.position;
			destination.routeLength = d.routeLength;
		}

		// 行走到距离最近的位置
		if (self.foot.end !== destination.position && destination.position >= 0) {
			self.foot.end = destination.position;
		}
	}
};

/**
 * 判断当前的角色,是否达到攻击敌人的位置
 * 现函数仅支持近站的单位
 *
 * @method attack
 * @extend {SWORD.Eye}
 * @example
 *	this.attack();
 * @return {boolean} 成功返回ture
 */

SWORD.Eye.prototype.attack = function() {
	return this.sprite.enemy && !astar.getNumberOfIntervals(this.sprite.currentGridID, this.sprite.enemy.currentGridID) && 
		   this.sprite.enemy.actionType !== 'run' ?
		   true : false;
};

