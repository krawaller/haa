exports.Class = View.extend({
	/*
Itemobject has:
 - race (0-3)
 - kind  (0-2, corresponding to unit/gear/spell)
 - name
	*/
	cls: "itemicon",
	init: function(item) {
		this.children = ["label "+item.name];
		this._super.call(this, item);
	}
});
