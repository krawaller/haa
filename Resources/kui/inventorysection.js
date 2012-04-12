exports.Class = TableViewSection.extend({
/*
 * opts has name and rows prop
 */
	init: function(opts) {
		headerView = K.create("label.inventorysectionheader "+opts.name)
		opts.rows.forEach(function(item){
			item.type = "inventoryitem";
			this.add(K.create({
				type: "tableviewrow",
				children: [item]
			}));
		});
		this._super.call(this, item);
	}
});