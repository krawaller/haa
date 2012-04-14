exports.Class = View.extend({
	/*
Itemobject has:
 - race (0-3)
 - kind  (0-2, corresponding to unit/gear/spell)
 - name
	*/
	cls: "itemicon",
	init: function(item) {
		var races = ["council","darkelf","dwarves","tribe"],
			kinds = ["unit","gear","spell"];
		this.children = [
			"label.itemiconrace "+races[item.race],
			"label.itemiconkind "+kinds[item.kind],
			"label.itemiconname "+item.name
		];
		this._super.call(this, item);
	}
});
