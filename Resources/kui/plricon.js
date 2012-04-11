exports.Class = View.extend({
	/*
Plrobject has:
 - race (0-3)
 - oppname
 - isme
 - oppid
 - home
	*/
	init: function(plr) {
		this.children = ["label.plriconname "+(plr.isme ? "ME" : plr.oppname)];
		this._super.call(this, plr);
	}
});
