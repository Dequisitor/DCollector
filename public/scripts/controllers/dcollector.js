var main = angular.module('myApp', ['mgcrea.ngStrap', 'ngCookies', 'ngAnimate', "sharedServices"]);

main.controller('mainController', function ($scope, listService, $http, $animate, $alert) {
	
	$scope.entries = [];

	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
		$scope.allEntries = entries;
		$scope.oldEntries = jQuery.extend(true, {}, entries); //create a copy of the array
	});

	//alerts
	$scope.sendOK = $alert({
		title: 'Server',
		content: 'Data saved successfully',
		type: 'success',
		container: '#alert-container',
		duration: 3,
		show: false
	});
	$scope.sendError = $alert({
		title: 'Server',
		content: 'Error sending data',
		type: 'danger',
		placement: 'top',
		container: '#alert-container',
		duration: 3,
		show: false
	});

	//send data to server
	$scope.sendData = function () {
		$http.post('/dcollector/saveData', { file: $scope.selectedFile, data: $scope.entries}).
			success(function (data, status, header, config) {
				$scope.sendOK.show();
			}).
			error(function (data, status, header, config) {
				$scope.sendError.show();
			});
	};

	$scope.evaluateFormula = function (entry) {
		var foundVariables = [];
		var data = $scope.entries;
		
		for (var i=0; i<data.length; i++) {
			foundVariables[data[i].name] = data[i].value;
		};				

		var newFormula = entry.formula;
		requiredVariables = newFormula.match(/\'[a-z|\ ]*\'/gi);
		for (var i=0; i<requiredVariables.length; i++) {
			newFormula = newFormula.replace(requiredVariables[i], foundVariables[requiredVariables[i].replace(/\'/g, '')]);
		};

		entry.value = Math.round($scope.$eval(newFormula)* 100) / 100;
	};

	$scope.showChanges = function (entry) {
		var oldEntries = $scope.oldEntries[$scope.selectedFile].data;
		var oldEntry = null;
		for (var i=0; i<oldEntries.length; i++) {
			if (oldEntries[i].name == entry.name) {
				oldEntry = oldEntries[i];
				break;
			}
		}

		if (!!oldEntry) {
			var diff = Math.round((entry.value - oldEntry.value) * 100);
			var sign = diff > 0 ? "+" : "";
			entry.diff = sign + diff/100;
		}
	};

	$scope.changeFile = function () {
		listService.setCurrentFile($scope.selectedFile, function (entries) {
			$scope.entries = entries;
		});
	};

	$scope.removeEntryFromList = function (entry) {
		listService.removeEntryFromList(entry);
	};
});
