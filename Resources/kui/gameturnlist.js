datamodule = require("/cogs/db");


exports.Class = View.extend({
	init: function(opts){
		turns = datamodule.getItems("turnswithinfo",{
			condstr: "gameid = "+opts.gameid
		});
		var table = K.create("tableview.turntable");
		
		table.setData(turns.map(function(turn){
			Ti.API.log(turn);
			return K.create({
				type: "turnrow",
				turnid: turn.turnid
			});
		}));
		this.children=[table];
		this._super.call(this, opts);
	}
});
