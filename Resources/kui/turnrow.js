datamodule = require("/cogs/db");

exports.Class = TableViewRow.extend({
	cls: "turnrow",
	init: function(turn) {
		uses = datamodule.getItems("useswithitems",{
			condstr: "turnid = "+turn.turnid,
			orderby: "turnid",
			orderdesc: true
		});
		items = [];
		n = 0;
		uses.forEach(function(item){
			var o = null;
			item.used = item.amount;
			while(item.used--){
				o = {
					type: "itemicon",
					name: item.name,
					race: item.race,
					kind: item.kind
				};
				o[turn.isme?"left":"right"] = n*63+3;
				items.push(o);
				n++;
			}
		});
		lbltxt = (turn.isme?"my ":turn.oppname)+" "+["council","darkelf","dwarves","tribe"][turn.race]+" team used";
		this.children = ["label.turninfo.turnrow"+(turn.isme?"me":"opp")+" "+lbltxt].concat(items);
		this._super.call(this, turn);
	}
});