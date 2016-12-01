;
(function(functionAsParam){
	functionAsParam(window.jQuery, window, document);
}(function($, window, document){
	// listen for the jQuery ready event on the document
	$(function() {
		// The DOM is ready!
		toDoFeature();
	});
}));

function toDoFeature(){
	var $buttonAddTask = $("#button-add-task");
	var $buttonDeleteTasksChecked = $("#button-delete-tasks-checked");
	var $textboxTask  = $("#textbox-task");
	var $listTasks = $("#list-tasks");
	var KEY_ENTER = 13;
	var $checkboxDoneTask = $(".checkbox-done-task");
	var $buttonDeleteTaskItem = $(".btn-delete-task-item");
	var $history = $("#history");
	var $buttonGetHistory= $("#button-get-history");

	// bind event for rendered element initially
	$checkboxDoneTask.on('change', doneTask);
	$buttonDeleteTaskItem.on('click', toTriggerDeleteTask);
	$buttonAddTask.on('click', toTriggerAddTask);
	$buttonDeleteTasksChecked.on('click', toTriggerDeleteTasksChecked);
	$textboxTask.keypress(enterToTriggerButtonAddTask);
	$buttonGetHistory.on('click', toTriggerGetHistory);
	
  	// listen custom event

  	$listTasks.on("task:add", addTaskToList);
  	$listTasks.on("task:delete", deleteTaskFromList);

	function toTriggerAddTask(){
		if($textboxTask.val() == ""){
	      alert("Please type a task on textbox");
	      $textboxTask.focus();
	      return false;
	    }

		var data = {
			action: {
				description: $textboxTask.val(),
				action_type: 'added task',
				activation_time: new Date()
			},
			task: {
				_id: null,
				description: $textboxTask.val(),
				status: {
					checked: false,
					deleted: false
				}
			}
		};			
		
		$listTasks.trigger("task:add", data);
	};

	function toTriggerDeleteTasksChecked(){
		$(".checkbox-done-task").each(function deleteTasksChecked(){
	        if($(this).is(":checked")){
	        	var data = {
	        		action: {
	        			task: $(this).parent(),
	        			description: $(this).parent().find("span").text(),
	        			action_type: 'deleted task',
	        			activation_time: new Date()
	        		},
	        		task: {
	        			_id: $(this).parent().find("label").text(),
	        			description: $(this).parent().find("span").text(),
	        			status: {
	        				checked: true,
	        				deleted: true
	        			}
	        		}
	        	};
	        	$listTasks.trigger("task:delete", data);
	        }
	    });
	};

	function enterToTriggerButtonAddTask(event){
		var isPressedEnter = event.which == KEY_ENTER;
		if(!isPressedEnter){
			return;
		}
		$buttonAddTask.trigger("click");
	};		


  	function addTaskToList(event, data){
	    $(this).prepend(
	    		"<a href='#' class='list-group-item'>"+
					"<input type='checkbox' class='checkboxDoneTask'>"+
					"<span>"+data.task.description+"</span>"+
					"<label class='hidden'>"+data.task._id+"</label>"+
					"<button class='pull-right btn-default btn-delete-task-item'>X</button>"+
				"</a>"
	    	);
		    var $newItem = $("#list-tasks a:first-child");


	    $newItem.find("button").on('click', toTriggerDeleteTask);
	    $newItem.find("input").on('change',doneTask);
	    $textboxTask.val("");
	    $textboxTask.focus();

		addAction(data.action);
		addTaskToServer(data.task).done(setHiddenId).fail(alertToNoticeAddTaskFailed);
	};

	function toTriggerGetHistory(){
		getHistory().done(showHistory);
	};

	function setHiddenId(data,  textStatus, jQxhr){
		var $newItem = $("#list-tasks a:first-child");
		$newItem.find("label").text(data.insertedIds[0]);
	};	

	function alertToNoticeAddTaskFailed(jqXhr, textStatus, errorThrown){
		alert(errorThrown);
	}

	function toTriggerDeleteTask(){
		
		var data = {
    		action: {
    			task: $(this).parent(),
    			description: $(this).parent().find("span").text(),
    			action_type: 'deleted task',
    			activation_time: new Date()
    		},
    		task: {
    			_id: $(this).parent().find("label").text(),
    			description: $(this).parent().find("span").text(),
    			status: {
    				checked: $(this).parent().find("input").is(":checked"),
    				deleted: true
    			}
    		}
    	};
		$listTasks.trigger("task:delete", data);
	}

  	function doneTask(){
  		var $task = $(this).parent();
  		var data = {
    		action: {
    			description: $task.find("span").text(),
    			action_type: null,
    			activation_time: new Date()
    		},
    		task: {
    			_id: $task.find("label").text(),
    			description: $task.find("span").text(),
    			status: {
    				checked: null,
    				deleted: false
    			}
    		}
    	};
    	if($(this).is(":checked")) {
    	    $task.find("span").addClass("done");
    	    data.action.action_type = "checked task";
    	    data.task.status.checked = true;
    	}else{    
    		$task.find("span").removeClass("done");
    	    data.action.action_type = "unchecked task";
    	    data.task.status.checked = false;
    	} 
    	addAction(data.action);
    	editTaskToServer(data.task);
  	};

	function deleteTaskFromList(event, data){
		data.action.task.remove();
		delete data.action.task;
		addAction(data.action);
		editTaskToServer(data.task);
	};  	

	function showHistory(history){
		$history.find("li").remove();
		var listAcctionHisoty = "";
        $.each(history, function(i, value){
        	listAcctionHisoty += ("<li class='list-group-item'>"+i+" : You "+value.action_type + " *"+ value.description +"* at "+value.activation_time+"</li>");
        });
        $history.append(listAcctionHisoty);
	};

// use Ajax to push request 	

	function getHistory(){
		var url = "http://localhost:3000/api/actions";
		console.log("using getJSON");
		return $.getJSON(url);
	}	
	
	function addAction(action){
		return $.ajax({
			url: "http://localhost:3000/api/actions",
			dataType: "json",
			type:'post',
			contentType: 'application/json',
			data: JSON.stringify(action)
		});
	}

	function editTaskToServer(task){
		return $.ajax({
			url: "http://localhost:3000/api/tasks",
			dataType: "json",
			type:'put',
			contentType: 'application/json',
			data: JSON.stringify(task)			
		});
	}

	function addTaskToServer(task){
		return $.ajax({
			url: "http://localhost:3000/api/tasks",
			dataType: "json",
			type:'post',
			contentType: 'application/json',
			data: JSON.stringify(task)			
		});
	}
} //toDoFeature

