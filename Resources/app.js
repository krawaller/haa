Ti.include("/kranium/lib/kranium.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

var tabs = K.createTabGroup({
	type: 'tabgroup',
	events: {
		app: {
			"openedgame": function(e){
				mywin = K.create({
					type: "window",
					children: [{
						type: "gameinventoryview",
						gameid: e.gameid
					}]
				}); // WANNA OPEN :(
				tabs.activeTab.open(mywin);
				return;				
				Ti.API.log(tabs); // TiUITabGroup
				Ti.API.log(tabs.currentTab); // null
				Ti.API.log(tabs.activeTab); // null
				Ti.API.log(tabs.tabs); // null
				Ti.API.log(tabs.getActiveTab); // null
				Ti.API.log(tabs.getActiveTabIndex); // null
				Ti.API.log(tabs.getTabs); // null
				Ti.API.log(tabs.children); // krollcallback
				Ti.API.log(tabs.children()); // empty array?!
				Ti.API.log(tabs.index); // krollcallback
				Ti.API.log(tabs.index()); // -1 :(
			}
		}
	},
	tabs: [{
		cls: 'myTab',
		title: "test",
		window: {
			cls: 'myWindow',
			children: [{
				type: "inventoryitem",
				race: 0,
				kind: 0,
				name: "soldier",
				used: 1,
				total: 3,
				adding: true,
				top: 5
			},{
				type: "turnrow",
				top: 40,
				turnid: 1
			}]
		}
	},
	{
		cls: 'myTab',
		title: "games",
		window: {
			children: ["gamelistview"]
		}
	},{
		cls: 'myTab',
		window: {
			children: [{
				type: "gameinventoryview",
				gameid: 1
			}]
		}
	},{
		cls: 'myTab',
		window: {
			type: "gameturnlist",
			gameid: 1
		}
	}]
});

tabs.open();
Ti.API.log(Ti.Filesystem.tempDirectory);
