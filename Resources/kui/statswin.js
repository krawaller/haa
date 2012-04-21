datamodule = require("/cogs/db");

exports.Class = Window.extend({
	title: "Statistics",
	init: function(opts){
		var tbl = K.create({
			type: "tableview",
			cls: "gametable"
		});
		this.table = tbl;
		this.children = [tbl];
		this.updateTable();
		this._super.call(this, opts);
	},
	updateTable: function(){
		var oppstats = datamodule.getItems("oppresultoverview",{
			orderby: "oppname"
		}).map(function(g){
			g.condstr = "oppid = "+g.oppid;
			g.name = g.oppname;
			g.header = "vs "+g.oppname;
			return g;
		});
		var total = [],
			races = [],
			compdata = datamodule.getItems("myresultsoverview").forEach(function(o){
				switch(o.what){
					case "total":
						o.condstr = "1 = 1"
						o.name = "All games";
						o.header = "games";
						total.push(o);
						break;
					case "councilall":
						o.condstr = "myrace = 0";
						o.name = "council";
						o.header = "with council";
						races.push(o);
						break;
					case "darkelfall":
						o.condstr = "myrace = 1";
						o.name = "darkelf";
						o.header = "with darkelf";
						races.push(o);
						break;
					case "dwarfall":
						o.condstr = "myrace = 2";
						o.name = "dwarves";
						o.header = "with dwarves";
						races.push(o);
						break;
					case "tribeall":
						o.condstr = "myrace = 3";
						o.name = "tribe";
						o.header = "with tribe";
						races.push(o);
						break;
				}
			});
		this.table.setData([
			this.buildSection("Total",total),
			this.buildSection("Per race",races),
			this.buildSection("Per opponent",oppstats)
		]);
	},
	buildSection: function(name,arr){
		sec = K.create({
			type: "tableviewsection",
			headerView: "label.tablesectionheader "+name
		});
		arr.forEach(function(item){
			item.type = "statrow";
			var row = K.create(item);
			sec.add(row);
		});
		return sec;
	},
	events: {
		app: {
			"oppstatschanged": function(){
				this.updateTable();
			}
		}
	}
});
