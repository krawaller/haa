exports.Class = View.extend({
/*
item object has:
 - race
 - kind
 - name
 - used
 - total
 - adding (bool)
*/
	cls: "inventoryitem",
	init: function(item) {
		this.added = 0;
		this.item = item;
		this.adding = item.adding;
		this.canadd = item.total - item.used;
		this.children = [{
			type: "itemicon",
			race: item.race,
			kind: item.kind,
			name: item.name
		},
			"label.usednumber"+(!item.used?".noused":item.used==item.total?".allused":"")+" "+item.used,
			"label.usedlabel used",
			"label.divider /",
			"label.totalnumber "+item.total,
			"label.totallabel total",
			"label.added"+(!item.adding?".hidden":"")+" +0"
		];
		this._super.call(this, item);
	},
	add: function(){ // should be clickhander on whole shebang!
		if (this.adding){
			var lbl = $$(".added")[0];
			if (this.added == this.canadd){
				this.added = 0;
				lbl.visible = false;
			} else {
				this.added += 1;
				lbl.text = "+"+this.added;
				lbl.visible = true;
			}
		}
	},
	getTotalAdded: function(){
		return this.added;
	}
});
