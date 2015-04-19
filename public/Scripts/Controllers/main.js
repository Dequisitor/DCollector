var main = angular.module('myApp', ['mgcrea.ngStrap', 'ngCookies', 'ngAnimate']);

main.controller('mainController', function ($scope, listService, $http, $animate, $alert) {
	listService.getList(function(list) {
		$scope.entries = list;
	});

	$scope.sendOK = $alert({
		title: 'Server',
		content: 'Data saved successfully',
		type: 'success',
		container: '#alert-container',
		duration: 2,
		show: false
	});

	$scope.sendError = $alert({
		title: 'Server',
		content: 'Error sending data',
		type: 'error',
		placement: 'top',
		container: '#alert-container',
		duration: 2,
		show: false
	});

	$scope.sendData = function () {
		$http.post('/addData', $scope.entries).
			success(function (data, status, header, config) {
				$scope.sendOK.show();
			}).
			error(function (data, status, header, config) {
				$scope.sendError.show();
			});
	};

	$scope.removeEntryFromList = function (name) {
		listService.removeEntryFromList(name);
	};

	$scope.evaluateFormula = function (entry, variables) {
		listService.getList(function (data) {
			var foundVariables = [];
			
			if (variables) {
				foundVariables = variables;
			} else {
				for (var i=0; i<data.length; i++) {
					foundVariables[data[i].name] = data[i].value;
				};				
			};

			var newFormula = entry.formula;
			requiredVariables = newFormula.match(/\'[a-z|\ ]*\'/gi);
			for (var i=0; i<requiredVariables.length; i++) {
				newFormula = newFormula.replace(requiredVariables[i], foundVariables[requiredVariables[i].replace(/\'/g, '')]);
			};

			entry.value = Math.round($scope.$eval(newFormula)* 10) / 10;
		});
	};
});
