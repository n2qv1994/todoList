'use strict'

function Task(){
	this.description = null;
	this.userid = null;
	this.status = {
		checked: false,
		deleted: false
	}
};

Task.prototype.setID = function(_id){
	this._id = _id;
};

Task.prototype.getID = function(){
	return this._id;
};

Task.prototype.setUserId = function(userid){
	this.userid = userid;
};

Task.prototype.getUserId = function(){
	return this.userid;
};

Task.prototype.setDescription = function(description){
	this.description = description;
};

Task.prototype.getDescription = function(){
	return this.description;
};

Task.prototype.setStatus = function(status){
	this.status.checked = status.checked;
	this.status.deleted = status.deleted;
};

Task.prototype.getStatus = function(){
	return this.status;
};

module.exports = Task;

