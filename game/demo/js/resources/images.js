
// 音频资源
var audioResources = {};
// 图片资源
var imageResources = {
	// 场景&背景
	scenes: {},
	// 布景
	layers: {},
	// 技能
	skill: {
		// 光
		light: {
			img: 'images/light.png',
			width: 92,
			height: 31
		},
		fireball: {
			img: 'images/spell/magic-light.png',
			width: 96,
			height: 66,
			offset:{ left:15, right: 29, down: 15, up: 21 },
			moveframeRate: 0,
			action: {
				run: {
					face: { up: { x: 0, y: 0 }, right: { x: 0, y: 0 }, down: { x: 0, y: 0 }  },
					frames: 2, width: 96, height: 66, frameRate: 0, move: true , loop: true, cooldown: 0
				},
				collision: {
					face: { up: { x: 0, y: 0 }, right: { x: 0, y: 0 }, down: { x: 0, y: 0 }  },
					frames: 5, width: 96, height: 66, frameRate: 0, move: true , loop: false, cooldown: 0
				}
			}
		}
	},
	// 精灵
	sprites: {
		// 魔法师 远程单位
		magician: {
			moveframeRate: 0,
			offset:{ left:25, right: 25, down: 5, up: 0 },
			range: { a: 80, b: 50 },
			// radius: 2,
			vision: 3,
			hp: 18000, mp: 6000,
			type: 'remote',	// 远程
			img: 'images/sprite/magician.png',
			action: {
				stand: {
					face: { up: { x: 0, y: 896 }, right: { x: 256, y: 896 }, down: { x: 512, y: 896 }  },
					frames: 2, width: 128, height: 128, x: 0, y: 0, frameRate: 100, move: true, loop: true, cooldown: 0
				},
				run: {
					face: { up: { x: 0, y: 0 }, right: { x: 0, y: 128 }, down: { x: 0, y: 256 }  },
					frames: 8, width: 128, height: 128, frameRate: 50, move: true , loop: true, cooldown: 0
				},
				hit: {
					face: { up: { x: 0, y: 384 }, right: { x: 0, y: 512 }, down: { x: 0, y: 640 }  },
					frames: 8, width: 128, height: 128, frameRate: 30, move: false, attackForce: { min: 315, max: 445 }, loop: true,
					cooldown: 150,
					event: {
						5: function(sprite) {
							if (sprite.enemy) {
								var o = new SWORD.Skill(SWORD.Texture.fromImage(imageResources.skill['fireball'].img), imageResources.skill['fireball'], sprite, 0);
						 		stage.addSprite( o );
						 		o.mark = 3;
							}
						}
					}
				},
				death: {
					face: { up: { x: 0, y: 768 }, right: { x: 0, y: 768 }, down: { x: 0, y: 768 }  },
					frames: 8, width: 128, height: 128, x: 492, y: 399, frameRate: 80, move: true, loop: false
				}
			}
		},
		// 近站单位
		lionPeople: {
			moveframeRate: 0,
			offset:{ left:25, right: 25, down: 5, up: 0 },
			range: { a: 80, b: 50 },
			vision: 2,
			hp: 13800, mp: 1600,
			img: 'images/sprite/lion-people.png',
			action: {
				stand: {
					face: { up: { x: 0, y: 896 }, right: { x: 256, y: 896 }, down: { x: 512, y: 896 }  },
					frames: 2, width: 128, height: 128, x: 0, y: 0, frameRate: 100, move: true, loop: true, cooldown: 0
				},
				run: {
					face: { up: { x: 0, y: 0 }, right: { x: 0, y: 128 }, down: { x: 0, y: 256 }  },
					frames: 8, width: 128, height: 128, frameRate: 20, move: true , loop: true, cooldown: 0
				},
				hit: {
					face: { up: { x: 0, y: 384 }, right: { x: 0, y: 512 }, down: { x: 0, y: 640 }  },
					frames: 5, width: 128, height: 128, frameRate: 0, move: true, attackForce: { min: 315, max: 445 }, loop: true,
					cooldown: 100,
					event: {
						4: function(sprite) {
						 	hurt(sprite);
						}
					}
				},
				death: {
					face: { up: { x: 0, y: 768 }, right: { x: 0, y: 768 }, down: { x: 0, y: 768 }  },
					frames: 8, width: 128, height: 128, x: 492, y: 399, frameRate: 80, move: true, loop: false
				}
			}
		},
		/*
		darkMagic:{
			moveframeRate: 15,
			offset:{ left:25, right: 25, down: 5, up: 0 },
			range: { a: 80, b: 50 },
			radius: 3,
			hp: 13800, mp: 1600,
			img: 'images/sprite/dark_magic.png',
			action: {
				stand: {
					face: { up: { x: 0, y: 129 }, right: { x: 0, y: 258 }, down: { x: 0, y: 645 }  },
					frames: 1, width: 150, height: 129, x: 0, y: 0, frameRate: 100, move: true, loop: true, cooldown: 0
				},
				run: {
					face: { up: { x: 0, y: 129 }, right: { x: 0, y: 258 }, down: { x: 0, y: 0 }  },
					frames: 12, width: 150, height: 129, frameRate: 20, move: true , loop: true, cooldown: 0
				},
				hit: {
					face: { up: { x: 0, y: 387 }, right: { x: 0, y: 387 }, down: { x: 0, y: 387 }  },
					frames: 12, width: 150, height: 129, frameRate: 0, move: true, attackForce: { min: 15, max: 45 }, loop: true,
					cooldown: 0,
					event: {
						4: function(sprite) {
						 	hurt(sprite);
						}
					}
				},
				death: {
					face: { up: { x: 0, y: 774 }, right: { x: 0, y: 774 }, down: { x: 0, y: 774 }  },
					frames: 8, width: 150, height: 129, frameRate: 80, move: true, loop: false
				}
			}
		},
		*/
		// 蜘蛛
		spider:{
			moveframeRate: 1,
			offset:{ left:25, right: 27, down: 17, up: 12 },
			range: { a: 80, b: 50 },
			vision: 2,
			hp: 13800, mp: 1600,
			img: 'images/sprite/spider.png',
			action: {
				stand: {
					face: { up: { x: 0, y: 226 }, right: { x: 0, y: 339 }, down: { x: 0, y: 113 }  },
					frames: 1, width: 150, height: 113, x: 0, y: 0, frameRate: 100, move: true, loop: true, cooldown: 0
				},
				run: {
					face: { up: { x: 0, y: 226 }, right: { x: 0, y: 0 }, down: { x: 0, y: 113 }  },
					frames: 13, width: 150, height: 113, frameRate: 20, move: true , loop: true, cooldown: 0
				},
				hit: {
					face: { up: { x: 0, y: 339 }, right: { x: 0, y: 339 }, down: { x: 0, y: 339 }  },
					frames: 19, width: 150, height: 113, frameRate: 0, move: true, attackForce: { min: 55, max: 65 }, loop: true,
					cooldown: 100,
					event: {
						13: function(sprite) {
						 	hurt(sprite);
						}
					}
				},
				death: {
					face: { up: { x: 900, y: 452 }, right: { x: 900, y: 452 }, down: { x: 900, y: 452 }  },
					frames: 8, width: 150, height: 113, frameRate: 80, move: true, loop: false
				}
			}
		}
	}
};