'use strict'
var MongoClient = require('mongodb');

var db = {
	connection: null
}

module.exports.connect = function(connectionString, callback){
	if(db.connection){
		return callback(false);
	}else{
		MongoClient.connect(connectionString, function(err, connection){
			if(!err){
				db.connection = connection;				
			}
			return callback(err);
		});
	}
};

module.exports.close = function(callback){
	if(db.connection){
		db.connection.close(function(err){
			if(!err){
				db.connection = null;
			}			
			return callback(err);
		});
	}else{
		console.log("Exception: Connection hasn't been already to close");
		callback(true);
	}
};

module.exports.getConnection = function(){
	return db.connection;
}