datamodule = require("/cogs/db");

exports.Class = View.extend({
	init: function(opts){ // called with gameid
		stocks = datamodule.getItems("gamestocks",{condstr: "gameid = "+opts.gameid});
		home = {units: [], gear: [], spells: []};
		away = {units: [], gear: [], spells: []};
		stocks.map(function(item){
			(item.home?home:away)[["units","gear","spells"][item.kind]].push(item);
		});
		var hometable = K.create("tableview.hometable"),
			awaytable = K.create("tableview.awaytable");
		hometable.setData(this.getRows(home));
		awaytable.setData(this.getRows(away));
		this.children = [hometable,awaytable];
		this._super.call(this, opts);
	},
	buildSection: function(name,arr){
		sec = K.create({
			type: "tableviewsection",
			headerView: "label.inventorysectionheader "+name
		});
		arr.forEach(function(item){
			item.type = "inventoryitem";
			sec.add(K.create({
				type: "tableviewrow",
				children: [item]
			}));
		});
		return sec;
	},
	getRows: function(stocks){
		return [
			/*{type: "inventorysection", name: "units", rows: stocks.units},
			{type: "inventorysection", name: "gear", rows: stocks.gear},
			{type: "inventorysection", name: "spells", rows: stocks.spells}*/
			this.buildSection("units",stocks.units),
			this.buildSection("gear",stocks.gear),
			this.buildSection("spells",stocks.spells)
		]
	}
});
