datamodule = require("/cogs/db");

exports.Class = TableView.extend({
	editable: true,
	init: function(opts){
		this.deleteFun = opts.deleteFun
		this.events = {
			"delete": function(o){
				opts.deleteFun(o);
			}
		};
		this._super.call(this, opts);
	},
	getEditButton: function(){
		table = this;
		var btn = K.create({
			type: "button",
			title: "edit",
			click: function(e){
				table.editing = !table.editing;
				btn.title = table.editing?"done":"edit";
			}
		});
		table.btn = btn;
		Ti.API.log(["BBB",btn]);
		return btn;
	}
});
