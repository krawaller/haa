datamodule = require("/cogs/db");

exports.Class = TableViewRow.extend({
	cls: "turnrow",
	init: function(turn) {
		uses = datamodule.getItems("useswithitems",{
			condstr: "turnid = "+turn.turnid
		});
		items = [];
		n = 0;
		uses.forEach(function(item){
			item.used = item.amount;
			while(item.used--){
				items.push({
					type: "itemicon",
					name: item.name,
					race: item.race,
					kind: item.kind,
					left: n*65
				});
				n++;
			}
		});
		Ti.API.log(items);
		this.children = items;
		this._super.call(this, turn);
	}
});