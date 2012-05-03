datamodule = require("/cogs/db");

exports.Class = Window.extend({
	cls: "newgamewin",
	storeData: function(){
		var ctrls = this.ctrls, oppname = ctrls.oppname.getValue(),mapname = ctrls.mapname.getValue();
		if (!oppname){
			ctrls.oppname.focus();
			return;
		}
		if (!mapname){
			ctrls.mapname.focus();
			return;
		}
		datamodule.saveGame({
			gameid: this.gameid,
			oppname: oppname,
			mapname: mapname,
			myrace: ctrls.myrace.getIndex(),
			opprace: ctrls.opprace.getIndex(),
			status: 0 // ongoing, as it is a new game
		});
	},
	events: {
		app: {
			gamedatachanged: function(e){
				this.close();
			}
		}
	},
	title: "New game",
	init: function(opts){ // called with gameid
		var opps = datamodule.getItems("opponents",{orderby:"name"}).map(function(opp){
			return opp.name;
		});
		var maps = datamodule.getItems("maps",{orderby:"name"}).map(function(map){
			return map.name;
		});
		var oppname = K.create({
			type: "listtextfield",
			cls: "oppfield",
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			height: "30dp",
			left: 20,
			width: 240,
			top: "18dp",
			hintText: "opponent name",
			zIndex: 11,
			list: opps
			/*events: {
				focus: function(){
					if (opps.length > 1) {
						opponentpicker.setVisible(true);
						oppname.width = 140;
					}
				},
				blur: function(){
					opponentpicker.setVisible(false);
					oppname.width = 240;
				}
			}*/
		});
		var mapname = K.create({
			type: "listtextfield",
			cls: "mapfield",
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			height: "30dp",
			left: 20,
			width: 240,
			top: "100dp",
			hintText: "map name",
			zIndex: 11,
			list: maps
			/*events: {
				focus: function(){
					if (opps.length > 1) {
						mappicker.setVisible(true);
						mapname.width = 140;
					}
				},
				blur: function(){
					mappicker.setVisible(false);
					mapname.width = 240;
				}
			}*/
		});
		/*var opponentpicker = K.create({
			type: "picker",
			cls: "opproll",
			right: 0,
			top: 0,
			height: 100,
			width: 160,
			visible: false,
			zIndex: 15,
			events: {
				change: function(e){
					oppname.setValue(e.row.title);
				}
			}
		});
		var mappicker = K.create({
			type: "picker",
			cls: "maproll",
			right: 0,
			top: 0,
			height: 100,
			width: 160,
			visible: false,
			zIndex: 15,
			events: {
				change: function(e){
					mapname.setValue(e.row.title);
				}
			}
		});
		opponentpicker.add(opps);
		mappicker.add(maps);*/
		myrace = K.create({
			type: "tabbedbar",
			labels: ["council","darkelf","dwarves","tribe"],
			top: 175,
			width: 240,
			height: 20,
			enabled: false,
			style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
			index: 0
		});
		opprace = K.create({
			type: "tabbedbar",
			labels: ["council","darkelf","dwarves","tribe"],
			top: 250,
			width: 240,
			height: 20,
			style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
			index: 0
		});
		var me = this;
		this.children = [
			//opponentpicker,mappicker,
			{
				type: "label",
				cls: "ctrlabel",
				text: "opponent",
				top: 0
			},{
				type: "label",
				cls: "ctrlabel",
				text: "map",
				top: 75
			},{
				type: "label",
				cls: "ctrlabel",
				text: "your race",
				top: 150
			},{
				type: "label",
				cls: "ctrlabel",
				text: "opponent race",
				top: 220
			},
			oppname,
			myrace,
			opprace,
			mapname,{
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
			mapname: mapname,
			myrace: myrace,
			opprace: opprace
		};
		this._super.call(this, opts);
	}
});
