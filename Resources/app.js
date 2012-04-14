Ti.include("/kranium/lib/kranium.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

var tabs = K.createTabGroup({
	type: 'tabgroup',
	events: {
		app: {
			"openedgame": function(e){
				mywin = K.create({
					type: "gameinventoryview",
					gameid: e.gameid
				});
				tabs.activeTab.open(mywin);
			},
			"openedturnlist": function(e){
				tabs.activeTab.open(K.create({
					type: "gameturnlist",
					gameid: e.gameid
				}))
			}
		}
	},
	tabs: [{
		title: "ongoing",
		window: { type: "gamelistview" }
	},{ 
		title: "statistics",
		window: { type: "stats" }
	}]
});

tabs.open();
Ti.API.log(Ti.Filesystem.tempDirectory);
