var dprocess = angular.module("dprocess", ["mgcrea.ngStrap", "sharedServices"]);

dprocess.controller("dprocessController", function ($scope, listService, $http, $alert) {
	
	$scope.chart = null;
	$scope.data = null;
	$scope.yAxis = null;

	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
	});

	$scope.getYAxis = function (unit) {
		var current = -1;
		for (var i=0; i<$scope.yAxis.length; i++) {
			if ($scope.yAxis[i].title == unit.toLowerCase()) {
				current = i;
			}
		};

		if (current == -1) { //add new unit to a new y axis
			$scope.yAxis.push({ 
				title: unit
			});
			return $scope.yAxis.length-1;
		};

		return current;
	};

	$scope.filterAxis = function() {
		var result = [];

		$scope.yAxis.forEach(function (axis) {
			result.push({
				title: axis.title,
				labels: {
						format: "{value} " + axis.title
				},
				opposite: result.length%2==1
			});
		});

		return result;
	}

	$scope.getDataSlot = function (entry) {
		var current = -1;
		for (var j=0; j<$scope.data.length; j++) {
			if ($scope.data[j].name == entry.name) {
				current = j;
			}
		}
		if (current == -1) { //add if it is new entry
			var axis = $scope.getYAxis(entry.unit); //just to fill the yAxis array
			$scope.data.push({
				name: entry.name, 
				visible: true,
				yAxis: entry.unit,
				data: [],
				type: "spline",
				color: Highcharts.getOptions().colors[$scope.data.length],
				tooltip: {
					valueSuffix: entry.unit
				}
			});
			current = $scope.data.length -1;
		}

		return current;
	};

	$scope.filterData = function () {
		var result = [];

		$scope.data.forEach(function (data) {
			if (data.visible) {
				result.push({
					name: data.name, 
					yAxis: $scope.getYAxis(data.yAxis),
					data: data.data,
					type: data.type,
					color: data.color,
					fillOpacity: 0.3,
					tooltip: data.tooltip
				});
			};
		});

		return result;
	};

	$scope.toggleSeries = function () {

	};

	$scope.createChart = function (fileName) {
		//if (!$scope.chart) {
			angular.element("#chartContainer").highcharts({
				chart: {
					zoomType: "x",
					plotBorderWidth: 1
				},
				legend: {
					enabled: false
				},
				title: {
					text: fileName
				},
				tooltip: {
					shared: true,
					crosshairs: true,
					valueDecimals: 2
				},
				xAxis: {
					type: "datetime",
					minRange: 24*3600*1000,
					title: {
						text: "Time"
					},
					tickInterval: 7*24*3600*1000,
					gridLineWidth: 1
				},
				yAxis: $scope.filterAxis(),
				series: $scope.filterData()
			});
			//$scope.chart = angular.element("#chartContainer").highcharts();
		//} else {
			//$scope.chart.series.data = $scope.filterData();
			//$scope.chart.yAxis = $scope.filterAxis();
			//$scope.chart.redraw();
		//}
	};

	$scope.drawChart = function (fileName) {
		$http.get("../../Data/" + fileName).success(function(json) {
			$scope.data = [];
			$scope.yAxis = [];
			json.forEach(function (entry) {
				for (var i=0; i<entry.data.length; i++) {
					if (!!entry.data[i].unit) {
						//search for data slot
						var current = $scope.getDataSlot(entry.data[i]);

						//add data
						var date = new Date(Date.parse(entry.timeStamp.replace(/Z/g,"")));
						var timeStamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
						$scope.data[current].data.push([timeStamp, entry.data[i].value]);
					}
				}
			});
			$scope.createChart(fileName);
		});
	};

	$scope.changeFile = function () {
		$scope.drawChart($scope.selectedFile);
	};

});
