var dprocess = angular.module("dprocess", ["mgcrea.ngStrap", "sharedServices"]);

dprocess.controller("dprocessController", function ($scope, listService, $http, $alert) {
	
	$scope.charts = [];
	$scope.data = null;
	$scope.dataReady = null;
	$scope.minX = null;
	$scope.maxX = null;

	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
	});

	$scope.createChart = function () {
		for (var i=Highcharts.charts.length-1; i>=0; i--) {
			if (!Highcharts.charts[i]) {
				continue;
			}
			Highcharts.charts[i].destroy();
		}
		angular.element(".chartContainer").css("height", $scope.data.length * 254 + 20);
		$scope.dataReady = $scope.data;
	};

	$scope.getDataSlot = function (entry) {
		var current = -1;
		for (var j=0; j<$scope.data.length; j++) {
			if ($scope.data[j].name == entry.name) {
				current = j;
			}
		}
		if (current == -1) { //add if it is new entry
			$scope.data.push({
				name: entry.name, 
				visible: true, 
				data: [],
				type: "spline",
				lineWidth: 2,
				color: Highcharts.getOptions().colors[$scope.data.length],
				tooltip: {
					valueSuffix: entry.unit
				}			});
			current = $scope.data.length -1;
		}

		return current;
	};

	$scope.drawChart = function () {
		$http.get("/dprocessor/data/" + $scope.selectedFile).success(function(json) {
			$scope.minX = null;
			$scope.maxX = null;
			$scope.data = [];
			json.forEach(function (entry) {
				for (var i=0; i<entry.data.length; i++) {
					if (!!entry.data[i].unit) {
						//search for data slot
						var current = $scope.getDataSlot(entry.data[i]);

						//add data
						var date = new Date(Date.parse(entry.timeStamp.replace(/Z/g,"")));
						var timeStamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
						$scope.data[current].data.push([timeStamp, entry.data[i].value]);

						//get min/max on the X axis
						if ((i == 0) && (!$scope.minX || $scope.minX > timeStamp)) { //since we store everything chronologically, we only need to check the first entries in all data fields
							$scope.minX = timeStamp;
						}
						if ((i == entry.data.length-1) && (!$scope.maxX || $scope.maxX < timeStamp)) { //likewise, we only check the last one
							$scope.maxX = timeStamp;
						}

					}
				}
			});

			$scope.createChart($scope.selectedFile);
		});
	};

	$scope.changeFile = function () {
		$scope.drawChart($scope.selectedFile);
	};

	$scope.redrawChart = function(pos, type) {
		var chart = angular.element("#chartContainer").highcharts();

		var index = pos;
		for (var i=0; i<pos; i++) {
			if (!$scope.data[i].visible) {
				index--;
			}
		}

		chart.series[index].update({
			type: type
		});
	};

});
