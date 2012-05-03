datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "notebtn",
	height: 30,
	width: 30,
	borderSize: 1,
	init: function(opts){ // called with noteid, notekind (map/game/opp), note
		this.backgroundColor = opts.note ? "#CCFFDC" : "#FFC5C5";
		this.children = [{
			type: "label",
			text: "N",
			top: 1,
			fontSize: 20,
			height: 20,
			textAlign: "center"
		},{
			type: "label",
			text: opts.notekind,
			bottom: 1,
			fontSize: 8,
			height: 10,
			textAlign: "center"
		}];
		this.click = function(e){ Ti.App.fireEvent("openednote",opts); };
		this._super.call(this, opts);
	}
});
