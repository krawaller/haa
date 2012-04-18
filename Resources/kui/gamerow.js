exports.Class = View.extend({
	cls: "gamerow",
	init: function(game) {
		var side = ["away","home"],
			me = side[game.home],
			opp = side[game.home?0:1],
			race = ["council","darkelves","dwarves","tribe"],
			status = ["ongoing","won","draw","lost"];
		this.children = [
			"label.name.myname."+me+"name me",
			"label.race."+me+"race "+race[game.myrace]+" ("+(game.mytotal-game.myused)+")",
			"label.vs VS",
			"label.status "+status[game.status],
			"label.name."+opp+"name "+game.oppname,
			"label.race."+opp+"race "+race[game.opprace]+" ("+(game.mytotal-game.oppused)+")"
		];
		this._super.call(this, game);
	}
});