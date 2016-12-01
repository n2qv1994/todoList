
var Task = require('../models/task.js');
var ObjectID = require('mongodb').ObjectID;
var database = require('../db/mongo.service.js');
var TaskManagement = require('../models/taskmanagement.js');

var connection = database.getConnection();	
var taskManagement = new TaskManagement(connection);

module.exports.insertTask = function(req,res){

	var body = req.body || '';
	var userid = req.session.passport.user;
	if(body === ''){
		return res.sendStatus(400);
	}

	var task = new Task();
	task.setID(new ObjectID());
	task.setUserId(userid);
	task.setDescription(body.description);
	task.setStatus(body.status);	
	
	taskManagement.insertTask(task, userid, function(err,result){
		if(err){
			return res.status(500).send();
		}
		return res.status(201).send(result);
	});
}

module.exports.editTask = function(req, res){
	var updatedTask = req.body || '';
	if(updatedTask === ''){
		return res.sendStatus(400);
	} 

	var _id = ObjectID(updatedTask._id);
	delete updatedTask._id;

	taskManagement.editTask({"_id": _id}, updatedTask, function(err, result){
		if(err){
			return res.status(500).send();
		}
		return res.status(201).send(result);
	})
};

module.exports.getTasks = function(req, res){
	var queryString = {"status.deleted": false};
	taskManagement.getTasks(queryString,function(err,tasks){
		if(err){
			res.status(500).send("Error on server");
		}else{
			res.status(200).send(tasks);
		}
	});
};

module.exports.loadHomePage = function(req, res){
	var _userid = req.session.passport.user;
	var queryString = {$and: [{"status.deleted": false},{userid:_userid}]};
	taskManagement.getTasks(queryString,function(err,_tasks){
		if(err){
			res.status(500).send("Error on server");
		}else{	
			console.log("=========================");
			console.log(req.user);
			console.log("=========================");
			// var data = {
			// 	tasks: _tasks,
			// 	user: req.user
			// }		
			res.status(200);
			res.render('home', {tasks : _tasks});
		}
	});
};

