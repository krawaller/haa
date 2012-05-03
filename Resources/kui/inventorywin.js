datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "gameinventory",
	title: "Game",
	events: {
		app: {
			gamedatachanged: function(e){
				if (e.because === "gamedeleted"){
					this.close();
				} else if (e.because !== "usesregistered"){
					this.updateSide("me");
					this.updateSide("opp");
					this.game = datamodule.getItems("gameswithusesoverview",{condstr: "gameid = "+this.gameid})[0];
					this.children[0].updateData(this.game);
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
			me = {},
			opp = {};
		stocks.map(function(item){
			(item.isme?me:opp)[item.name] = item;
		});
		this.stockData = {
			me: me,
			opp: opp
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
				kind: item.kind,
				total: item.total,
				top: Math.floor(i/2)*39 + 120,
				left: (i%2)*75 + {me:5,opp:170}[side]
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
		this.invs = {me:{},opp:{}};
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
		["me","opp"].forEach(function(side){
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
		this.rightNavButton = K.create({
			type: "view",
			height: 25,
			width: 100,
			children: [{
				type: "button",
				height: 25,
				width: 40,
				title: "del",
				style: Titanium.UI.iPhone.SystemButtonStyle.DELETE,
				left: 0,
				click: function(e){
					K.create({
						type: "optiondialog",
						cancel: 1,
						destructive: 0,
						options: ["delete","cancel"],
						click: function(e){
							if (e.index===0){
								datamodule.deleteGame(opts.gameid);
							}
						}
					}).show();
				}
			},{
				type: "button",
				height: 25,
				width: 40,
				style: Titanium.UI.iPhone.SystemButtonStyle.EDIT,
				title: "edit",
				click: function(e){
					Ti.App.fireEvent("editgame",{gameid: opts.gameid})
				},
				right: 0
			}]
		});
		this._super.call(this, opts);
		this.updateInvs("me");
		this.updateInvs("opp");
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
		var game = datamodule.getItems("gameswithusesoverview",{condstr: "gameid = "+this.gameid})[0];
		if (side==="me"){
			amount = game.mytotal-game.myused;
		} else {
			amount = game.opptotal-game.oppused;
		}
		this.children[0][(side==="me"?"updateMyUses":"updateOppUses")](amount);
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
