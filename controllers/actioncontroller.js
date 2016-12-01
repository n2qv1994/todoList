
var Action = require('../models/action.js');
var database = require('../db/mongo.service.js');
var ActionManagement = require('../models/actionmanagement.js');
var connection = database.getConnection();	
var actionManagement = new ActionManagement(connection);
var action = new Action();

module.exports.insertAction = function(req,res){
	var description = req.body.description || '';
	var action_type = req.body.action_type || '';
	var activation_time = req.body.activation_time || '';

	action.setDescription(description);
	action.setActionType(action_type);
	action.setActivationTime(activation_time);
	
	if(action === ''){
		return res.sendStatus(400);
	}
	actionManagement.insertAction(action,function(err,result){
		if(err){
			return res.status(500).send();
		}
		return res.status(201).send(result);
	});
}

module.exports.getActions = function(req, res){
	actionManagement.getActions(function(err,result){
		if(err){
			res.status(500).send("Error on server");
		}else{
			res.status(200).send(result);
		}
	});
};