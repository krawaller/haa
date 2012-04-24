Ti.include("/kranium/lib/kranium.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

var tabs = K.createTabGroup({
	type: 'tabgroup',
	events: {
		app: {
			"openedgame": function(e){
				mywin = K.create({
					type: "inventorywin",
					gameid: e.gameid
				});
				tabs.activeTab.open(mywin);
			},
			"openedturnlist": function(e){
				tabs.activeTab.open(K.create({
					type: "turnlistwin",
					gameid: e.gameid
				}))
			},
			"openedgamelist": function(e){
				tabs.activeTab.open(K.create({
					type: "gamelistwin",
					condstr: e.condstr,
					header: e.header,
					gameid: e.gameid
				}))
			},
			"editgame": function(e){
				tabs.activeTab.open(K.create({
					type: "editgamewin",
					gameid: e.gameid
				}));
			}
		}
	},
	tabs: [{
		title: "test",
		window: {
			type: "editgamewin",
			gameid: 1
		}
	},{
		title: "ongoing",
		window: {
			type: "gamelistwin",
			header: "Current",
			allowAdd: true,
			condstr: "status = 0"
		}
	},{ 
		title: "statistics",
		window: { type: "statswin" }
	}]
});

tabs.open();
Ti.API.log(Ti.Filesystem.tempDirectory);
