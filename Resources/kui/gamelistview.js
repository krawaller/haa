datamodule = require("/cogs/db");


exports.Class = Window.extend({
	title: "Current",
	init: function(opts){
		var tbl = K.create({
			type: "tableview",
			cls: "gametable",
			click: function(e){Ti.App.fireEvent("openedgame",{gameid:e.row.gameid});}
		});
		this.table = tbl;
		this.children = [tbl];
		this.updateTable();
		this._super.call(this, opts);
	},
	updateTable: function(){
		var data = datamodule.getItems("gameswithusesoverview",{
			condstr: "status = 0",
			orderby: "prio",
			orderdesc: true
		}).map(function(g){
			g.type = "gamerow";
			return K.create({
				type: "tableviewrow",
				gameid: g.gameid,
				children:[g]
			});
		});
		this.table.setData(data);
	},
	events: {
		app: {
			"gamedatachanged": function(){
				this.updateTable();
			}
		}
	}
});
