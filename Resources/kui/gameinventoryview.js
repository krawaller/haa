datamodule = require("/cogs/db");

exports.Class = View.extend({
	loadData: function(){
		var stocks = datamodule.getItems("gamestocks",{condstr: "gameid = "+this.gameid}),
			home = {units: [], gear: [], spells: []},
			away = {units: [], gear: [], spells: []};
		stocks.map(function(item){
			(item.home?home:away)[["units","gear","spells"][item.kind]].push(item);
		});
		this.stockData = {
			home: home,
			away: away
		};
	},
	updateTable: function(side){
		var tbl = this.tables[side],
			data = this.stockData[side];
		tbl.setData([
			this.buildSection("units",data.units),
			this.buildSection("gear",data.gear),
			this.buildSection("spells",data.spells)
		]);
	},
	buildSection: function(name,arr){
		sec = K.create({
			type: "tableviewsection",
			headerView: "label.inventorysectionheader "+name
		});
		arr.forEach(function(item){
			item.type = "inventoryitem";
			sec.add(K.create(item));
		});
		return sec;
	},
	init: function(opts){ // called with gameid
		game = datamodule.getItems("gameswithopp",{condstr: "gameid = "+opts.gameid});
		this.gameid = opts.gameid;
		this.game = game;
		var hometable = K.create("tableview.hometable"),
			awaytable = K.create("tableview.awaytable"),
			homebtn = K.create("button.homebutton"),
			awaybtn = K.create("button.awaybutton");
		this.tables = {
			home: hometable,
			away: awaytable
		};
		this.loadData();
		this.updateTable("home");
		this.updateTable("away");
		this.children = [hometable,awaytable,homebtn,awaybtn];
		this.home = 0;
		this.away = 0;
		this._super.call(this, opts);
		me = this;
		this.btns = {
			home: homebtn,
			away: awaybtn
		};
		hometable.addEventListener("click",function(e){ me.receiveClick("home",e.row); });
		awaytable.addEventListener("click",function(e){ me.receiveClick("away",e.row); });
		homebtn.addEventListener("click",function(e){ me.submitClick("home"); });
		awaybtn.addEventListener("click",function(e){ me.submitClick("away"); });
		this.updateButton(homebtn,0);
		this.updateButton(awaybtn,0);
	},
	submitClick: function(side){
		var table = this.tables[side],
			sections = table.data,
			intotal = this[side],
			sidenum = {home:1,away:0}[side],
			uses = [];
		for(var s=0;s<sections.length;s++){
			var sec = sections[s],
				rows = sec.rows;
			for(var r=0;r<rows.length;r++){
				var row = rows[r],
					added = row.added,
					item = row.item;
				if (added){
					uses.push({
						amount: added,
						itemid: item.itemid,
						kind: item.kind
					})
					row.resetUses();
				}
			}
		}
		datamodule.addItemUses(this.gameid,side,uses);
		this[side] = 0;
		this.updateButton(this.btns[side],0);
		this.loadData();
		this.updateTable(side);
	},
	receiveClick: function(side,row){
		var item = row.item,
			side = ["away","home"][row.home];
		if (row.added === row.canadd){
			this[side] -= row.added;
			row.addUse();
		} else if (this[side] === 5){
			this[side] -= row.added;
			row.resetUses();
		} else {
			this[side]++;
			row.addUse();
		}
		this.updateButton(this.btns[side],this[side]);
	},
	updateButton: function(btn,nbr){
		if(nbr === 0){
			btn.title = "select items below";
			btn.setEnabled(false);
		} else {
			btn.title = "submit "+nbr+" item"+(nbr>1?"s":"");
			btn.setEnabled(true);
		}
	}
});
