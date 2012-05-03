exports.Class = View.extend({
	cls: "gamerow",
	init: function(game) {
		var side = ["away","home"],
			me = "home", //side[game.home],
			opp = "away"; // side[game.home?0:1],
//			race = ["council","darkelves","dwarves","tribe"],
//			status = ["ongoing","won","draw","lost"];
		this.children = [
			"label.name.myname."+me+"name me",
			K.create("label.race."+me+"race"),
			"label.vs VS",
			K.create("label.status"),
			K.create("label.name."+opp+"name "),
			K.create("label.race."+opp+"race")
		];
		this._super.call(this, game);
		this.updateData(game);
	},
	updateData: function(game){
		var race = ["council","darkelves","dwarves","tribe"],
			status = ["ongoing","won","lost","draw"],
			lbls = this.children;
		lbls[1].setText(race[game.myrace]+" (666)");
		lbls[3].setText(status[game.status]);
		lbls[4].setText(game.oppname);
		lbls[5].setText(race[game.opprace]+" (666)");
		this.updateMyUses(game.mytotal-game.myused);
		this.updateOppUses(game.opptotal-game.oppused);
	},
	updateMyUses: function(amount){
		var label = this.children[1];
		label.setText(label.getText().replace(/\(\d*\)$/,"("+amount+")"));
	},
	updateOppUses: function(amount){
		var label = this.children[5];
		label.setText(label.getText().replace(/\(\d*\)$/,"("+amount+")"));
	}
});