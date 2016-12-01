'use strict'

function Action(){};

Action.prototype.setDescription = function(description){
	this.description = description;
};

Action.prototype.setActivationTime =function(activation_time){
	this.activation_time = activation_time;
};
Action.prototype.setActionType =function(action_type){
	this.action_type = action_type;
};

Action.prototype.getDescription = function(){
	return this.description;
};

Action.prototype.getActivationTime = function(){
	return this.activation_time;
};
Action.prototype.getActionType = function(){
	return this.action_type;
};

module.exports = Action;