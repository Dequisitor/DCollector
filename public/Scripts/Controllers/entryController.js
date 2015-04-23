angular.module('myApp')
.controller('entryController', function ($scope, listService) {

	$scope.name = "";
	$scope.unit = "";
	$scope.value = "";
	$scope.formula = "";
	$scope.valueType = 0;

	$scope.addEntryToList = function () {
		if ($scope.valueType == 1) {
			listService.addEntryToList({name: $scope.name, unit: $scope.unit, formula: $scope.formula, value: null});
		} else {
			listService.addEntryToList({name: $scope.name, unit: $scope.unit, value: $scope.value, formula: null});
		};
	};

});
