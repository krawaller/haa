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
		sql += " WHERE " + opts.condstr
	}
	if (opts.orderby){
		sql+= " ORDER BY "+opts.orderby+" "+(opts.orderdesc?"DESC":"ASC");
	}
	var mould = {};
	for (var i=0; i<props.length;i++){
		mould[props[i]] = props[i]
	};
	return dbQuery(sql,mould);
}

var DBNAME = "HAA 005",
	db = Titanium.Database.install("/cogs/heroacademyaid.sqlite", DBNAME);

exports.db = db;

exports.getCurrentGames = function() {
	o = {
		table: "gameswithopp",
		props: ["gameid","oppname","myrace","opprace","status","gamenote","oppnote","prio"],
		condstr: "status = 0",
		orderby: "prio",
		orderdesc: true
	};
	return dbDex(o);
};

exports.poop = "scoop";
