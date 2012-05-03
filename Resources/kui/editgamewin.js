datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "editgamewin",
	title: "Edit game",
	setGameVals: function(gameid){
		var ctrls = this.ctrls, game = datamodule.getItems("gameswithusesoverview",{
			condstr: "gameid = "+gameid
		})[0] || {};
		this.gameid = gameid;
		ctrls.gamestate.setIndex(game.status || 0);
	},
	storeData: function(gameid){
		var ctrls = this.ctrls,
			game = datamodule.getItems("gameswithusesoverview",{
				condstr: "gameid = "+gameid
			})[0];
		game.status = ctrls.gamestate.getIndex();
		datamodule.saveGame(game);
	},
	events: {
		app: {
			gamedatachanged: function(e){
				this.close();
			}
		}
	},
	init: function(opts){ // called with gameid
		this.gameid = opts.gameid
		gamestate = K.create({
			type: "tabbedbar",
			labels: ["ongoing","won","lost"],
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
				text: "game status",
				top: 220
			},
			gamestate,
			{
				type: "button",
				width: 120,
				bottom: 30,
				height: 30,
				title: "Save",
				click: function(e){
					me.storeData(opts.gameid);
				}
			}
		];
		this.ctrls = {
			gamestate: gamestate
		};
		this.setGameVals(opts.gameid);
		this._super.call(this, opts);
	}
});
