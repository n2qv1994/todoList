var express = require('express');

var taskController = require('../controllers/taskcontroller.js');
var actionController = require('../controllers/actioncontroller.js');
var router = express.Router();

router.post('/tasks', taskController.insertTask);
router.get('/tasks', taskController.getTasks);
router.put('/tasks', taskController.editTask);

router.post('/actions', actionController.insertAction);
router.get('/actions', actionController.getActions);

module.exports = router;