datamodule = require("/cogs/db");


exports.Class = Window.extend({
	cls: "gameturnlist",
	init: function(opts){
		turns = datamodule.getItems("turnswithinfo",{
			condstr: "gameid = "+opts.gameid
		});
		var table = K.create({
			type: "tableview",
			editable: true,
			cls: "turntable",
			events: {
				"delete": function(e){datamodule.deleteTurn(e.row.turnid);}
			}
		});
		
		table.setData(turns.map(function(turn){
			turn.type = "turnrow";
			return K.create(turn);
		}));
		

		this.rightNavButton = K.create({
			type: "button",
			title: "edit",
			click: function(e){
				table.editing = !table.editing;
				this.title = table.editing?"done":"edit";
			}
		});
		var label = K.create("label.instruction Here you can see the individual turns added for this game. Any erroneous entries can be deleted by first touching the edit button.");
		this.children=[label,table];
		this._super.call(this, opts);
	}
});
