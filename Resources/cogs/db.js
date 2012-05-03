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

var DBNAME = "HAA 016",
	db = Titanium.Database.install("/cogs/heroacademyaid.sqlite", DBNAME);

var datatypes = {
	opponents: ["id","name","note"],
	maps: ["id","name","note"],
	gameswithopp: ["gameid","oppname","myrace","opprace","status","gamenote","oppnote","prio","mapid","mapname","mapnote"],
	gameswithusesoverview: ["gameid","home","oppname","oppid","myrace","opprace","status","gamenote","oppnote","prio","myused","mytotal","oppused","opptotal","mapid","mapname","mapnote"],
	gamestocks: ["gameid","race","home","isme","kind","name","itemid","total","used","note","prio"],
	useswithitems: ["turnid","itemid","kind","name","race","amount","total","prioruses"],
	turnswithinfo: ["turnid","gameid","home","oppname","isme","race","prio"],
	oppresultoverview: ["oppid","oppname","ongoing","wins","losses","oppnote"],
	myresultsoverview: ["what","ongoing","wins","losses"], // what = [total,darkelfall,]
	mapresults: ["mapid","mapname","mapnote","ongoing","wins","losses"],
	notes: ["noteid","kind","name","note"]
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
		mapid = dbSinglePropQuery("SELECT id FROM maps WHERE name = ?","id",[game.mapname]),
		maxprio = dbSinglePropQuery("SELECT max(prio) as maxprio FROM games","maxprio");
	if (!oppid){
		dbOperation("INSERT INTO opponents (name) VALUES (?)",[game.oppname]);
		oppid = dbSinglePropQuery("SELECT max(id) as maxid FROM opponents","maxid");
	}
	if (!mapid){
		dbOperation("INSERT INTO maps (name) VALUES (?)",[game.mapname]);
		mapid = dbSinglePropQuery("SELECT max(id) as maxid FROM maps","maxid");
	}
	if (game.gameid){
		dbOperation("UPDATE games SET opponentid = ?, mapid = ?, opprace = ?, myrace = ?, status = ? WHERE id = ?",[oppid,mapid,game.opprace,game.myrace,game.status,game.gameid]);
		prioritizeGame(game.gameid,maxprio);
	} else {
		dbOperation("INSERT INTO games (opponentid, mapid, opprace, myrace, status, prio) VALUES (?,?,?,?,?,?)",[oppid,mapid,game.opprace,game.myrace,game.status,maxprio||1]);
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

exports.getNote = function(id,kind){
	if (kind === "enemy"){ kind = "opponent";}
	return dbSinglePropQuery("SELECT note FROM notes WHERE noteid = ? and kind = ?","note",[id,kind]);
}

exports.setNote = function(id,kind,text){
	var table = {
		enemy: "opponents",
		game: "games",
		map: "maps"
	}[kind];
	if (!text){
		dbOperation("DELETE FROM "+table+" WHERE id = ?",[id])
	} else {
		dbOperation("UPDATE "+table+" SET note = ? WHERE id = ?",[text,id])
	}
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
