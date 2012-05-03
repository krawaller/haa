Ti.include("/kranium/lib/kranium.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

var tabs = K.createTabGroup({
	type: 'tabgroup',
	events: {
		app: {
			openedgame: function(e){
				mywin = K.create({
					type: "inventorywin",
					gameid: e.gameid
				});
				tabs.activeTab.open(mywin);
			},
			openedturnlist: function(e){
				tabs.activeTab.open(K.create({
					type: "turnlistwin",
					gameid: e.gameid
				}))
			},
			openedgamelist: function(e){
				tabs.activeTab.open(K.create({
					type: "gamelistwin",
					condstr: e.condstr,
					header: e.header,
					gameid: e.gameid
				}))
			},
			editgame: function(e){
				tabs.activeTab.open(K.create({
					type: "editgamewin",
					gameid: e.gameid
				}));
			},
			newgame: function(e){
				tabs.activeTab.open(K.create({
					type: "newgamewin"
				}));
			},
			openednote: function(e){
				tabs.activeTab.open(K.create({
					type: "notewin",
					note: e.note,
					notekind: e.notekind,
					noteid: e.noteid
				}));
			}
		}
	},
	tabs: [{
		title: "test",
		window: {
			type: "window",
			children: [{
				type: "notebutton",
				notekind: "whoop",
				note: "dsa",
				top: 30,
				left: 30
			}]
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
