exports.Class = TableViewRow.extend({
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
			"label.added"
		];
		this._super.call(this, item);
	},
	updateAddLabel: function(amount){
		var lbl = $(".added",this)[0];
		if (!amount){
			lbl.visible = false;
		} else {
			lbl.text = "+"+amount;
			lbl.visible = true;
		}
	},
	resetUses: function(e){
		this.added = 0;
		this.updateAddLabel(0);
	},
	addUse: function(e){
		if (this.added === this.canadd){
			this.added = 0;
		} else {
			this.added += 1;
		}
		this.updateAddLabel(this.added);
	},
	getTotalAdded: function(){
		return this.added;
	}
});
