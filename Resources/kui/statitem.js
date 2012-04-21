exports.Class = View.extend({
	cls: "statitem",
	init: function(data) {
		this.children = [
			"label.num "+data.number,
			"label.lbl "+data.label
		];
		this._super.call(this, data);
	},
	events: {
		click: function(e){
			//alert(this.condstr+" - "+this.header);
			Ti.App.fireEvent("openedgamelist",{condstr: this.condstr,header: this.header});
		}
	}
});