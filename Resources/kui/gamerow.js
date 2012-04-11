exports.Class = TableViewRow.extend({
	init: function(game) {
		this.children = [{
			type: "label",
			text: "VS "+game.oppname
		}];
		this._super.call(this, game);
	}
});
