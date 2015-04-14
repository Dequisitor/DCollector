var main = angular.module('myApp', ['mgcrea.ngStrap', 'ngCookies']);

main.controller('mainController', function ($scope, listService, $http) {
	listService.getList(function(list) {
		$scope.entries = list;
	});

	$scope.sendData = function () {
		$http.post('/addData', $scope.entries).
			success(function (data, status, header, config) {
				console.log('successfully sent data');
			}).
			error(function (data, status, header, config) {
				console.log('error sending data: '+data);
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
