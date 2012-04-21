Ti.include("/kranium/lib/kranium.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

var tabs = K.createTabGroup({
	type: 'tabgroup',
	events: {
		app: {
			"openedgame": function(e){
				mywin = K.create({
					type: "gameinventoryview2",
					gameid: e.gameid
				});
				tabs.activeTab.open(mywin);
			},
			"openedturnlist": function(e){
				tabs.activeTab.open(K.create({
					type: "gameturnlist",
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
			}
		}
	},
	tabs: [{
		title: "test",
		window: {
			type: "window",
			title: "WTF",
			children: [{
				type: "invitem",
				name: "poobit",
				used: 2,
				total: 3,
				usenumber: 2,
				top: 20
			},{
				type: "view",
				width: 20,
				height: 20,
				bottom: 20,
				right: 20,
				backgroundColor: "blue"
			}]
		}
	},{
		title: "ongoing",
		window: {
			type: "gamelistwin",
			header: "Current",
			condstr: "status = 0"
		}
	},{ 
		title: "statistics",
		window: { type: "stats" }
	}]
});

tabs.open();
Ti.API.log(Ti.Filesystem.tempDirectory);
