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

var DBNAME = "HAA 010",
	db = Titanium.Database.install("/cogs/heroacademyaid.sqlite", DBNAME);

var datatypes = {
	opponents: ["id","name","note"],
	gameswithopp: ["gameid","oppname","myrace","opprace","status","gamenote","oppnote","prio"],
	gameswithusesoverview: ["gameid","home","oppname","oppid","myrace","opprace","status","gamenote","oppnote","prio","myused","mytotal","oppused","opptotal"],
	gamestocks: ["gameid","race","home","isme","kind","name","itemid","total","used","note","prio"],
	useswithitems: ["turnid","itemid","kind","name","race","amount","total","prioruses"],
	turnswithinfo: ["turnid","gameid","home","oppname","isme","race","prio"],
	oppresultoverview: ["oppid","oppname","ongoing","wins","stalemates","losses"],
	myresultsoverview: ["what","ongoing","wins","stalemates","losses"] // what = [total,darkelfall,]
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

function prioritizeGame(gameid,_maxprio){
	var currentprio = dbSinglePropQuery("SELECT prio FROM games WHERE id = ?","prio",[gameid]),
		maxprio = _maxprio || dbSinglePropQuery("SELECT max(prio) as maxprio FROM games","maxprio");
	dbOperation("UPDATE games SET prio = prio - 1 WHERE prio > ?",[currentprio]);
	dbOperation("UPDATE games SET prio = ? WHERE id = ?",[maxprio,gameid]);
}
exports.saveGame = function(game){
	var oppid = dbSinglePropQuery("SELECT id FROM opponents WHERE name = ?","id",[game.oppname]),
		maxprio = dbSinglePropQuery("SELECT max(prio) as maxprio FROM games","maxprio");
	if (!oppid){
		dbOperation("INSERT INTO opponents (name) VALUES (?)",[game.oppname]);
		oppid = dbSinglePropQuery("SELECT max(id) as maxid FROM opponents","maxid");
	}
	if (game.gameid){
		dbOperation("UPDATE games SET opponentid = ?, opprace = ?, myrace = ?, status = ? WHERE id = ?",[oppid,game.opprace,game.myrace,game.status,game.gameid]);
		prioritizeGame(game.gameid,maxprio);
	} else {
		dbOperation("INSERT INTO games (opponentid, opprace, myrace, status, prio) VALUES (?,?,?,?,?)",[oppid,game.opprace,game.myrace,game.status,maxprio||1]);
	}
	Ti.App.fireEvent("gamedatachanged",{because:"gamesaved"});
};
exports.addItemUses = function(gameid,side,uses){
	dbOperation("INSERT INTO turns (gameid,isme,prio) VALUES (?, ?, ?)",[
		gameid, side == "me" ? 1 : 0, 666
	]);
	var turnid = dbSinglePropQuery("SELECT max(id) as turnid FROM turns","turnid");
	for(var i = 0; i<uses.length;i++){
		var use = uses[i]
		dbOperation("INSERT INTO uses (turnid,itemid,amount,kind) VALUES (?,?,?,?)",[
			turnid, use.itemid, use.amount, use.kind
		]);
	}
	Ti.App.fireEvent("gamedatachanged",{because:"usesregistered"});
}
exports.deleteTurn = function(turnid){
	dbOperation("DELETE FROM turns WHERE id = ?",[turnid]);
	dbOperation("DELETE FROM uses WHERE turnid = ?",[turnid]);
	Ti.App.fireEvent("gamedatachanged",{because:"turndeleted"});
}
exports.deleteGame = function(gameid){
	dbOperation("DELETE FROM uses WHERE turnid IN (SELECT id FROM turns WHERE gameid = ?)",[gameid]);
	dbOperation("DELETE FROM turns WHERE gameid = ?",[gameid]);
	dbOperation("DELETE FROM games WHERE id = ?",[gameid]);
	Ti.App.fireEvent("gamedatachanged",{because:"gamedeleted"});
}

exports.poop = "scoop";
