exports.Class = TableViewRow.extend({
	cls: "statrow",
	init: function(data) {
		this.children = [{
			type: "label",
			cls: "name",
			text: data.name,
			click: function(e){
				alert(data.condstr+" - "+data.header);
				Ti.App.fireEvent("opengames",{constr: data.condstr,header: data.header});
			}
		},{
			type: "statitem",
			cls: "current",
			number: data.ongoing,
			label: "current",
			left: "100dp",
			header: "current "+data.header,
			condstr: data.condstr + " AND status = 0"
		},{
			type: "statitem",
			cls: "won",
			number: data.wins,
			label: "won",
			left: "150dp",
			header: "won "+data.header,
			condstr: data.condstr + " AND status = 1"
		},{
			type: "statitem",
			cls: "draw",
			number: data.stalemates,
			label: "draw",
			left: "200dp",
			header: "drawn "+data.header,
			condstr: data.condstr + " AND status = 2"
		},{
			type: "statitem",
			cls: "loss",
			number: data.losses,
			label: "lost",
			left: "250dp",
			header: "lost "+data.header,
			condstr: data.condstr + " AND status = 3"
		}];
		this._super.call(this, data);
	}
});