function ActionManagement(connection){
	this.connection = connection;
};

ActionManagement.prototype.insertAction = function(action, callback){
	var collection = this.connection.collection('action');
	var newAction = {
		description: action.getDescription(),
		action_type: action.getActionType(),
		activation_time: action.getActivationTime(),
	};
	var insertActionSuccess = function(result){
		return callback(false,result);
	};
	var insertActionFalse = function(err){
		return callback(true,null);
	}
	collection.insert(newAction)
		.then(insertActionSuccess)
		
		.catch(insertActionFalse);
}

ActionManagement.prototype.getActions = function(callback){
	var collection = this.connection.collection('action');
	var notifyGetActionSuccess = function(result){
		return callback(false, result);
	};
	var notifyGetActionFail = function(err){
		return callback(err, null);
	};
	var actions = collection.find().toArray()
		.then(notifyGetActionSuccess)
		.catch(notifyGetActionFail);
};

module.exports = ActionManagement;
