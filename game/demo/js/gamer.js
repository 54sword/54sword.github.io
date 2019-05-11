function createGamer () {
	return {
		gold: 0,
		wood: 0,
		population: 0,
		army: {},
		init : function () {
			var gamer = this.getInfo();
			if (gamer) {
				this.gold = gamer.gold;
				this.wood = gamer.wood;
				this.population = gamer.population;
				this.army = gamer.army;
			}
		},
		addArmy: function(roleName) {
			if (this.army[roleName]) {
				this.army[roleName]++;
			} else {
				this.army[roleName] = 1;
			}
			this.updata();
		},
		getInfo : function () {
			return this.updata();
			//return localStorage.gamer ? JSON.parse(localStorage.gamer) : this.updata();
		},
		destroy : function () {
			localStorage.removeItem("gamer");
		},
		updata : function () {
			this.population = 0;
			for (var i in this.army) {
				this.population += this.army[i];
			}
			localStorage.gamer = JSON.stringify({gold: this.gold, wood: this.wood, population: this.population, army: this.army});
		}
	};
}
var gamer = createGamer();
gamer.init();