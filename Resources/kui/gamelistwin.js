datamodule = require("/cogs/db");


exports.Class = Window.extend({
	title: "Game list",
	init: function(opts){ // condstr and header
		var tbl = K.createTableView({
//			type: "tableview",
			cls: "gametable",
			click: function(e){
				if (!e.row.isnogamewarning){
					Ti.App.fireEvent("openedgame",{gameid:e.row.gameid});
				}
			}
		});
		this.condstr = opts.condstr;
		this.headertext = opts.header;
		this.table = tbl;
		this.children = [tbl];
		this.updateTable();
		this._super.call(this, opts);
	},
	updateTable: function(){
		var rows = datamodule.getItems("gameswithusesoverview",{
			condstr: this.condstr,
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
		var section = K.createTableViewSection({
			headerView: "label.tablesectionheader "+this.headertext,
			rows: rows.length ? rows : [K.create({
				type: "tableviewrow",
				isnogamewarning: true,
				children: ["label.nogamesrow (no games to list)"]
			})]
		});
		this.table.setData([section]);
		//this.table.data[0].setHeaderView(K.create("label.tablesectionheader "+this.headertext));
	},
	events: {
		app: {
			"gamedatachanged": function(){
				this.updateTable();
			}
		}
	}
});