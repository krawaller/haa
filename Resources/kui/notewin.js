datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "notewin",
	events: {
		app: {
			gamedatachanged: function(e){
				this.close();
			}
		}
	},
	init: function(opts){ // called with noteid, notekind, note
		var me = this;
		this.title = "Note on "+opts.notekind;
		this.children = [
			K.create({
				type: "textfield",
				value: datamodule.getNote(opts.noteid,opts.notekind),
				height: 200,
				width: 200,
				top: 20,
				left: 20
			}),
			{
				type: "button",
				height: 25,
				bottom: 20,
				width: 80,
				title: "save",
				click: function(e){
					datamodule.setNote(opts.noteid,opts.notekind,me.children[0].getValue());
					Ti.App.fireEvent("gamedatachanged",{because:"notechanged"});
				}
			}
		];
		this._super.call(this, opts);
	}
});
