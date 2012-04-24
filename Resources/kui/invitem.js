exports.Class = View.extend({
/*
item object has:
 - race
 - kind
 - name
 - used
 - total
 - usenumber (can be undefined)
*/
	cls: "invitem",
	init: function(item) {
		this.added = 0;
		this.item = item;
		this.adding = item.adding;
		this.canadd = item.total - item.used;
		this.children = [
			K.create("label.name "+item.name),
			K.create("label.used"), // creating so we can access from @children
			"label.added"
		];
		item.backgroundColor = ["#FEFFDB","#FFE1D4","#FFDCEA"][item.kind];
		this._super.call(this, item);
		this.updateUses(item);
	},
	updateUses : function(item){
		var lbl = this.children[1],
			name = this.children[0],
			txt = [],
			remaining = item.total - item.used;
			
		name.setColor(remaining?"#000":"red");
		this.canadd = remaining;
		for(var i = 1; i<=item.total;i++){
			if (i<=remaining){
				txt.push("o");
			} else {
				txt.push(i === item.usenumber ? "X" : "x");
			}
		}
		lbl.setText(txt.join(" "));
	},
	updateAddLabel: function(amount){
		var lbl = $(".added",this)[0];
		if (!amount){
			lbl.visible = false;
		} else {
			lbl.text = "-"+amount;
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
