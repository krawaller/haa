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
		},
		click: function(e){
			Ti.API.log(["CLICK!",e]);
		}
	},
	loadData: function(){
		var stocks = datamodule.getItems("gamestocks",{
			condstr: "gameid = "+this.gameid,
			orderby: "kind"
		}),
			home = {},
			away = {};
		stocks.map(function(item){
			(item.home?home:away)[item.name] = item;
		});
		this.stockData = {
			home: home,
			away: away
		};
	},
	buildInvs: function(side){
		var i = 0,
			arr = [],
			data = this.stockData[side],
			me = this;
		for(var itemname in data){
			var item = data[itemname],
			inv = K.create({
				type: "invitem",
				name: item.name,
				used: item.used,
				total: item.total,
				top: Math.floor(i/2)*39 + 120,
				left: (i%2)*75 + {home:5,away:170}[side]
			});
			inv.item = item;
			inv.addEventListener("click",(function(o,s){return function(e){
				me.receiveItemClick(s,o);
			}})(inv,side));
			this.invs[side][itemname] = inv;
			arr.push(inv);
			i++;
		}
		return arr;
	},
	updateInvs: function(side){
		var invs = this.invs[side],
			data = this.stockData[side];
		if (!invs){
			this.buildInvs(data,side);
			invs = this.invs[side]
		}
		for(var itemname in data){
			invs[itemname].updateUses(data[itemname]);
		}
	},
	init: function(opts){ // called with gameid
		game = datamodule.getItems("gameswithusesoverview",{condstr: "gameid = "+opts.gameid})[0];
		this.gameid = opts.gameid;
		this.game = game;
		this.invs = {home:{},away:{}};
		this.btns = {};
		game.type = "gamerow";
		game.top = 5;
		
		controls = [K.create(game),{
			type: "button",
			cls: "toturnlistbutton",
			click: function(e){Ti.App.fireEvent("openedturnlist",{gameid:opts.gameid})}
		}];
		me = this;
		this.loadData();
		["home","away"].forEach(function(side){
			var btn = K.create("button."+side+"button"),
				invs = me.buildInvs(me.stockData[side],side)
			me.btns[side] = btn;
			controls.push(btn);
			controls = controls.concat(me.buildInvs(side));
			btn.addEventListener("click",function(e){ me.submitClick(side); });
			me.updateButton(btn,0);
			me[side] = 0; 
		});
		this.children = controls;
		this._super.call(this, opts);
		this.updateInvs("home");
		this.updateInvs("away");
	},
	submitClick: function(side){
		var uses = [], invs = this.invs[side], inv, item, added;
		for(var iname in invs){
			inv = invs[iname];
			item = inv.item;
			added = inv.added;
			if (added){
				uses.push({amount: added,itemid: item.itemid,kind: item.kind,prioruses:item.used})
				inv.resetUses();
			}
		}
		datamodule.addItemUses(this.gameid,side,uses);
		this.loadData();
		this.updateSide(side);
	},
	updateSide: function(side){
		this[side] = 0;
		this.updateButton(this.btns[side],0);
		this.loadData();
		this.updateInvs(side);
		var label = $("."+side+"race",this.children[0])[0];
		var game = datamodule.getItems("gameswithusesoverview",{condstr: "gameid = "+this.gameid})[0];
		if (side=="home"){
			amount = (game.home ? game.mytotal-game.myused : game.opptotal-game.oppused);
		} else {
			amount = (game.home ? game.opptotal-game.oppused : game.mytotal-game.myused);
		}
		label.text = label.text.replace(/\(\d*\)$/,"("+amount+")");
	},
	receiveItemClick: function(side,row){
		var item = row.item;
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
