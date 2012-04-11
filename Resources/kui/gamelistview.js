datamodule = require("/cogs/db");


exports.Class = View.extend({
	children: [{
		type: "tableview",
		data: datamodule.getCurrentGames().map(function(g){
			g.type = "gamerow";
			return K.create(g);
		})
	}]
});
