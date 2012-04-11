exports.Class = View.extend({
	init: function(opts) {
		this.datamodule = require("/cogs/db");
		this.children = [{
			type: "tableview",
			data: this.datamodule.getCurrentGames().map(function(g){
				g.type = "gamerow";
				return K.create(g);
			})
		}];
		this._super.call(this, opts);
	}
});
