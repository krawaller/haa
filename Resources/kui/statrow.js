exports.Class = TableViewRow.extend({
	cls: "statrow",
	init: function(data) {
		kids = []
		if (data.note !== undefined){
			kids.push(K.create({
				type: "notebutton",
				note: data.note,
				notekind: data.notekind,
				noteid: data.noteid,
				left: 5
			}));
		}
		kids.push({
			type: "label",
			left: data.note !== undefined ? 50 : 5,
			text: data.name,
			click: function(e){
				Ti.App.fireEvent("openedgamelist",{condstr: data.condstr,header: "all "+data.header});
			}
		});
		
		kids.push({
			type: "statitem",
			cls: "currentitem",
			number: data.ongoing,
			label: "current",
			left: "100dp",
			header: "current "+data.header,
			condstr: data.condstr + " AND status = 0"
		});
		kids.push({
			type: "statitem",
			cls: "wonitem",
			number: data.wins,
			label: "won",
			left: "150dp",
			header: "won "+data.header,
			condstr: data.condstr + " AND status = 1"
		});
		kids.push({
			type: "statitem",
			cls: "lossitem",
			number: data.losses,
			label: "lost",
			left: "200dp",
			header: "lost "+data.header,
			condstr: data.condstr + " AND status = 2"
		});
		this.children = kids;
		this._super.call(this, data);
	}
});