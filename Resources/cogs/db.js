function dbSinglePropQuery(sql, prop, varargs) {
	//		var db = Ti.Database.open(DBNAME);
	if (!db || !db.execute || (typeof db.execute !== "function")) {
		throw "No DB available for: " + sql;
	}
	var res = db.execute(sql, varargs || []),
		ret;
	if (!res) {
		throw "Error! Error! " + sql + " ||| " + prop;
	}
	if (res.isValidRow()) {
		ret = res.fieldByName(prop);
	}
	res.close();
	//		db.close();
	return ret;
}



function dbQuery(sql, mould, varargs) {
	//		var db = Ti.Database.open(DBNAME),
	var res = db.execute(sql, varargs || []),
		ret = [],
		i = -1,
		p;
	while (res.isValidRow()) {
		i++;
		ret[i] = {};
		for (p in mould) {
			ret[i][p] = res.fieldByName(mould[p]);
		}
		res.next();
	}
	res.close();
	//		db.close();
	return ret;
}



function dbOperation(sql, varargs) {
	//		var db = Ti.Database.open(DBNAME),
	var res = db.execute(sql, varargs || []);
	if (res) {
		res.close();
	}
	//		db.close();
}


/*
table: string, name of table
props: array of props we want
condstring: 
orderby: string, colname
orderdesc: true/false
*/
function dbDex(opts){
	var props = opts.props, sql = "SELECT "+props.join(",")+" FROM "+opts.table;
	if (opts.condstr){
		sql += " WHERE " + opts.condstr;
	}
	if (opts.orderby){
		sql+= " ORDER BY "+opts.orderby+" "+(opts.orderdesc?"DESC":"ASC");
	}
	var mould = {};
	for (var i=0; i<props.length;i++){
		mould[props[i]] = props[i];
	};
	return dbQuery(sql,mould);
}

var DBNAME = "HAA 007",
	db = Titanium.Database.install("/cogs/heroacademyaid.sqlite", DBNAME);

var datatypes = {
	gameswithopp: ["gameid","oppname","myrace","opprace","status","gamenote","oppnote","prio"],
	gameswithusesoverview: ["gameid","oppname","myrace","opprace","status","gamenote","oppnote","prio","myused","mytotal","oppused","opptotal"],
	gamestocks: ["gameid","race","home","isme","kind","name","itemid","total","used","note","prio"],
	useswithitems: ["turnid","itemid","kind","name","race","amount","total"],
	turnswithinfo: ["turnid","gameid","home","oppname","isme","race","prio"]
};

exports.db = db;

function getItems(datatype,opts){
	opts = opts || {};
	opts.props = datatypes[datatype]; 
	opts.table = datatype;
	return dbDex(opts);
};
exports.getItems = getItems;
exports.getCurrentGames = function() {
	return getItems("gameswithopp",{
		condstr: "status = 0",
		orderby: "prio",
		orderdesc: true
	});
};

exports.poop = "scoop";
