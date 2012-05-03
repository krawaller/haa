

exports.Class = TextField.extend({
	// opts.list is an array of strings
	keyboardToolbarHeight: 40,
	click: function(e){
		Ti.API.log(["WOOT WOOT",e.source,e.target,e])
	},
	init: function(opts){
		var list = opts.list,
			max = list.length,
			me = this,
			flexspace = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE}),
			btnwidth = 80,
			btnspacing = 5,
			scrollview = K.createScrollView({
				showVerticalScrollIndicator:false,
			    showHorizontalScrollIndicator:true,
				height: 30,
				width: max*btnwidth+max*btnspacing+btnspacing,
				children: list.map(function(item,i){
					return K.createButton({
						width: btnwidth,
						left: btnwidth*i+btnspacing*i+btnspacing,
						height: 26,
						top: 3,
						title: item,
						click: function(e){
							Ti.API.log(["WTF",me,item]);
							me.setValue(item);
						}
					});
				})
			});
		this.keyboardToolbar = [flexspace,scrollview,flexspace];
		this._super.call(this, opts);
	}
});