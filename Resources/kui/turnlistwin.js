datamodule = require("/cogs/db");


exports.Class = Window.extend({
	title: "Item uses",
	cls: "gameturnlist",
	init: function(opts){
		turns = datamodule.getItems("turnswithinfo",{
			condstr: "gameid = "+opts.gameid,
			orderby: "turnid",
			orderdesc: true
		});
		var table = K.create({
			type: "tableview",
			editable: true,
			cls: "turntable",
			events: {
				"delete": function(e){datamodule.deleteTurn(e.row.turnid);}
			}
		});
		
		if (turns.length){
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
		} else {
			table.setData([K.create({
				type: "tableviewrow",
				isnogamewarning: true,
				children: ["label.emptytablerow (no turns to list)"]
			})]);
		}
		var label = K.create("label.instruction Here you can see the individual turns added for this game. Any erroneous entries can be deleted by first touching the edit button.");
		this.children=[label,table];
		this._super.call(this, opts);
	}
});
