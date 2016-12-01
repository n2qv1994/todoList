function TaskManagement(connection){
	this.connection = connection;
};

TaskManagement.prototype.insertTask = function(task, callback){

	var collection = this.connection.collection('task');
	var insertTaskSuccess = function (result){
		return callback(false,result);
	};
	var insertTaskFalse = function(err){
		return callback(true,null);
	};	
	collection.insert(task).then(insertTaskSuccess).catch(insertTaskFalse);
};

TaskManagement.prototype.getTasks = function(queryString,callback){
	var collection = this.connection.collection('task');
	var notifyConvertToArraySuccess = function(tasks){
		if(tasks.length == 0){
			console.log("cannot found");
		}else{
			console.log(tasks);
		}
		return callback(false, tasks);
	};
	var notifyConvertToArrayFail = function(err){
		return callback(true, null);
	};
	collection.find(queryString).toArray()
		.then(notifyConvertToArraySuccess)
		.catch(notifyConvertToArrayFail);
};

TaskManagement.prototype.editTask = function(selector, doc, callback){
	var collection = this.connection.collection('task');
	var editTaskSuccess = function (result){
		return callback(false,result);
	};
	var editTaskFalse = function(err){
		return callback(true,null);
	};
	collection.updateOne(selector, {$set: doc}).then(editTaskSuccess).catch(editTaskFalse);
};

module.exports = TaskManagement;