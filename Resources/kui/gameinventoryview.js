datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "gameinventory",
	title: "Game inventory",
	events: {
		app: {
			"gamedatachanged": function(e){
				if (e.because != "usesregistered"){
					this.updateSide("home");
					this.updateSide("away");
				}
			}
		}
	},
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
		game = datamodule.getItems("gameswithusesoverview",{condstr: "gameid = "+opts.gameid})[0];
		this.gameid = opts.gameid;
		this.game = game;
		this.tables = {};
		this.btns = {};
		game.type = "gamerow"
		controls = [K.create(game),{
			type: "button",
			cls: "toturnlistbutton",
			click: function(e){Ti.App.fireEvent("openedturnlist",{gameid:opts.gameid})}
		}];
		me = this;
		this.loadData();
		["home","away"].forEach(function(side){
			var table = K.create("tableview."+side+"table"),
				btn = K.create("button."+side+"button");
			me.tables[side] = table;
			me.btns[side] = btn;
			controls = controls.concat([table,btn]);
			table.addEventListener("click",function(e){ me.receiveItemClick(side,e.row); });
			btn.addEventListener("click",function(e){ me.submitClick(side); });
			me.updateButton(btn,0);
			me.updateTable(side);
			me[side] = 0; 
		});
		this.children = controls;
		this._super.call(this, opts);
	},
	submitClick: function(side){
		var table = this.tables[side],
			sections = table.data,
			intotal = this[side],
			sidenum = {home:1,away:0}[side],
			uses = [];
		for(var s=0;s<sections.length;s++){
			var sec = sections[s],rows = sec.rows;
			for(var r=0;r<rows.length;r++){
				var row = rows[r],added = row.added,item = row.item;
				if (added){
					uses.push({amount: added,itemid: item.itemid,kind: item.kind})
					row.resetUses();
				}
			}
		}
		datamodule.addItemUses(this.gameid,side,uses);
		this.updateSide(side);
	},
	updateSide: function(side){
		this[side] = 0;
		this.updateButton(this.btns[side],0);
		this.loadData();
		this.updateTable(side);
		var label = $("."+side+"race",this.children[0])[0];
		var game = datamodule.getItems("gameswithusesoverview",{condstr: "gameid = "+this.gameid})[0];
		if (side=="home"){
			amount = game.home ? game.myuses : game.oppuses;
		} else {
			amount = game.home ? game.oppuses : game.myuses;
		}
		label.text = label.text.replace(/\(\d*\)$/,"("+amount+")");
	},
	receiveItemClick: function(side,row){
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
			btn.color = "#BBB";
		} else {
			btn.title = "submit "+nbr+" item"+(nbr>1?"s":"");
			btn.setEnabled(true);
			btn.color = "#000";
		}
	}
});
