angular.module('myApp')
.controller('entryController', function ($scope, listService) {

	$scope.name = "";
	$scope.unit = "";
	$scope.value = "";
	$scope.formula = "";
	$scope.valueType = 0;

	$scope.evaluateFormula = function (formula, foundVariables) {
		var newFormula = formula;
		requiredVariables = formula.match(/\'[a-z|\ ]*\'/gi);
		for (var i=0; i<requiredVariables.length; i++) {
			newFormula = newFormula.replace(requiredVariables[i], foundVariables[requiredVariables[i].replace(/\'/g, '')]);
		};

		return Math.round($scope.$eval(newFormula)* 10) / 10;
	};

	$scope.addEntryToList = function () {
		if ($scope.valueType == 1) {
			listService.addEntryToList({name: $scope.name, unit: $scope.unit, formula: $scope.formula, value: null});
		} else {
			listService.addEntryToList({name: $scope.name, unit: $scope.unit, value: $scope.value, formula: null});
		};
	};

});
