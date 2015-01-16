/*!
* script.js
* This file contains the code for task manager using knockout.
* 
* @project   TASK MANAGER
* @date      2015-01-13 
* @author    SHARDENDU <buntycs@gmail.com>
* @licensor  Shardendu
* @NOTE
*/

// Declaring namespace parameter
var taskmanager = taskmanager || {};

var initialData = [
    { taskId: "1", taskName: "Lorem Ipsum dolor Lorem Ipsum dolor Lorem Ipsum dolor", status: "Pending"},
    { taskId: "2", taskName: "Lorem Ipsum dolor Lorem Ipsum dolor Lorem Ipsum dolor", status: "Completed"},
    { taskId: "3", taskName: "1Lorem Ipsum dolor Lorem Ipsum dolor Lorem Ipsum dolor1", status: "New"}
];

$(function() {
	var taskmanagerdiv = $("#taskmanager");
	if(taskmanagerdiv.length === 0){
		return;
	}

	taskmanager.taskmanagerVM = function(tasks){
		
		var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri","Sat"];

		var self = this;
		
		// Custom handler to apply class for validation element
		ko.bindingHandlers.validationElement = {
        update: function (element, valueAccessor) {
                var valueIsValid = valueAccessor().isValid();
                if (!valueIsValid && self.showErrorMessages() === true) {
                    $(element).addClass("input-error");
                } else {
                    $(element).removeClass("input-error");
                }
            }
        }

		self.showErrorMessages = ko.observable(false);
		self.pendingTotal = ko.observable(0);
		self.newTotal = ko.observable(0);
		self.completedTotal = ko.observable(0);
		
		self.tasks = ko.observableArray(ko.utils.arrayMap(tasks, function(task) {
	        return { taskId: task.taskId, taskName: task.taskName, status: task.status };
	    }));

	    self.taskid = ko.observable();
	    self.task = ko.observable("");
	    self.status = ko.observable("");
	    self.filterselect = ko.observable("");
	    self.idOrder = ko.observable("ascending");
	    self.taskOrder = ko.observable("ascending");
	    self.isEditMode = ko.observable(false);
	    self.statusList = [{id: "", text: "Select"}, {id: "New", text: "New"}, {id: "Pending", text: "Pending"}, {id: "Completed", text: "Completed"}]

		self.today = ko.computed(function(){
			var today = new Date();	
			return dayNames[today.getDay()]+', '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear();		
		});

		self.statusCount = function() {
			var newCount = 0, pendingCount = 0, completedCount = 0;
			$.each(self.tasks(), function(key, value){ 
				if(value.status === "New"){
					newCount++;
				}
				else if(value.status === "Pending"){
					pendingCount++;
				}
				else if(value.status === "Completed"){
					completedCount++;
				}
			});
			self.newTotal(newCount);
			self.pendingTotal(pendingCount);
			self.completedTotal(completedCount);
		}
		self.clearTask = function(){
			self.isEditMode(false);
			self.taskid("");
			self.task("");
			self.status("");
		}
		self.removeTask = function(task){
			self.tasks.remove(task);
			self.statusCount();
		}
		self.addTask = function(){
			if (self.isValid()) {
				if(self.isEditMode() === false){
					self.tasks.push({
						taskId: self.taskid(),
						taskName: self.task(),
						status: self.status()
					});
				}
				else if(self.isEditMode() === true){
					console.log('123');
					self.isEditMode(false);
				}				
				self.statusCount();
				$('#myModal').modal('hide');
			}
			else {
				self.showErrorMessages(true);
			}
		}
		self.editTask = function(data) {
			self.isEditMode(true);
			self.taskid(data.taskId);
			self.task(data.taskName);
			self.status(data.status);
		}
		self.sortTask = function(sortBy){
			switch(sortBy){
				case 'byid':
					if(self.idOrder() == 'ascending'){
						self.tasks.sort(function(a,b) { return parseFloat(b.taskId) - parseFloat(a.taskId) });
						self.idOrder('descending');
					}
					else{
						self.tasks.sort(function(a,b) { return parseFloat(a.taskId) - parseFloat(b.taskId) });
						self.idOrder('ascending');
					}					
				break;
				case 'bytask':
					if(self.taskOrder() == 'ascending'){
						self.tasks.sort(function(a,b){
							return (a.taskName).localeCompare(b.taskName);
						});
						self.taskOrder('descending');
					}
					else{
						self.tasks.sort(function(a,b){
							return (b.taskName).localeCompare(a.taskName);
						});
						self.taskOrder('ascending');
					}
				break;
			}
		}
		self.init = function(){
			self.isEditMode(false);
			ko.validation.init({
				insertMessages: false
			});
			self.applyValidations();
			self.statusCount();
		};

		//Form validation

		self.applyValidations = function () {
			self.taskid.extend({
				required: {message: 'Please enter task id'},
                pattern: {
                    message: 'Please enter numbers only',
                    params: /^\d+$/
                }
			});
			self.task.extend({
				required: {message: 'Please enter your task details'}
			});
			self.status.extend({
				required: {message: 'Please select status'}
			});
			self.errorGroup = ko.validation.group([self.taskid, self.task, self.status]);
		};
	}

	// apply binding of view model, but only if it exists
	var view = taskmanagerdiv.get(0); 
	if(view){
		var vmTaskmanager = new taskmanager.taskmanagerVM(initialData);
		vmTaskmanager.init();
		ko.applyBindings(ko.validatedObservable(vmTaskmanager), view);
	}
});