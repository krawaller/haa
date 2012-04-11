Ti.include("/kranium/lib/kranium.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#FFF');

K({
	type: 'tabgroup',
	tabs: [{
		cls: 'myTab',
		window: {
			cls: 'myWindow',
			children: [{
				type: "inventoryitem",
				race: 0,
				kind: 0,
				name: "soldier",
				used: 2,
				total: 3,
				addto: true
			}]
		}
	},
	{
		cls: 'myTab',
		window: {
			children: ["gamelistview"]
		}
	}]
}).open();
