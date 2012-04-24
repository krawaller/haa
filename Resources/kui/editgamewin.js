datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "editgamewin",
	setGameVals: function(gameid){
		var ctrls = this.ctrls, game = datamodule.getItems("gameswithusesoverview",{
			condstr: "gameid = "+gameid
		})[0];
		this.gameid = gameid;
		ctrls.oppname.setValue(game.oppname);
		ctrls.myrace.setIndex(game.myrace || 0);
		ctrls.opprace.setIndex(game.opprace || 0);
		ctrls.gamestate.setIndex(game.status || 0);
		if (!gameid){
			ctrls.opprace.visible = false;
			ctrls.myrace.visible = false;
			this.children[1].visible = false;
			this.children[2].visible = false;
		}
	},
	storeData: function(){
		var ctrls = this.ctrls, oppname = ctrls.oppname.getValue();
		if (!oppname){
			ctrls.oppname.focus();
			return;
		}
		datamodule.saveGame({
			gameid: this.gameid,
			oppname: oppname,
			myrace: ctrls.myrace.getIndex(),
			opprace: ctrls.opprace.getIndex(),
			status: ctrls.gamestate.getIndex()
		});
	},
	events: {
		app: {
			gamedatachanged: function(e){
				this.close();
			}
		}
	},
	init: function(opts){ // called with gameid
		this.title = opts.gameid ? "Edit game" : "New game";
		var oppname = K.create({
			type: "textfield",
			cls: "oppfield",
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			height: "30dp",
			left: 20,
			width: 240,
			top: "18dp",
			hintText: "opponent name",
			zIndex: 11,
			events: {
				focus: function(){
					if (opps.length > 1) {
						picker.setVisible(true);
					}
				},
				blur: function(){picker.setVisible(false);}
			}
		});
		var picker = K.create({
			type: "picker",
			cls: "opproll",
			right: 0,
			top: 0,
			height: 100,
			width: 160,
			visible: false,
			zIndex: 10,
			events: {
				change: function(e){
					oppname.setValue(e.row.title);
				}
			}
		});
		var opps = datamodule.getItems("opponents",{orderby:"name"}).map(function(opp){
			return {
				value: opp.id,
				title: opp.name
			};
		});
		picker.add(opps);
		myrace = K.create({
			type: "tabbedbar",
			labels: ["council","darkelf","dwarves","tribe"],
			top: 100,
			width: 240,
			height: 20,
			enabled: false,
			style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
			index: 0
		});
		opprace = K.create({
			type: "tabbedbar",
			labels: ["council","darkelf","dwarves","tribe"],
			top: 175,
			width: 240,
			height: 20,
			style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
			index: 0
		});
		gamestate = K.create({
			type: "tabbedbar",
			labels: ["ongoing","won","drawn","lost"],
			top: 250,
			width: 240,
			height: 20,
			style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
			index: 0
		});
		var me = this;
		this.children = [{
				type: "label",
				cls: "ctrlabel",
				text: "opponent",
				top: 0
			},{
				type: "label",
				cls: "ctrlabel",
				text: "your race",
				top: 75
			},{
				type: "label",
				cls: "ctrlabel",
				text: "opponent race",
				top: 150
			},{
				type: "label",
				cls: "ctrlabel",
				text: "game status",
				top: 220
			},
			oppname,
			myrace,
			opprace,
			gamestate,
			picker,{
				type: "button",
				width: 120,
				bottom: 30,
				height: 30,
				title: "Save",
				click: function(e){
					me.storeData();
				}
			}
		];
		this.ctrls = {
			oppname: oppname,
			myrace: myrace,
			opprace: opprace,
			gamestate: gamestate
		};
		if (opts.gameid){
			this.setGameVals(opts.gameid);
		}
		this._super.call(this, opts);
	}
});
