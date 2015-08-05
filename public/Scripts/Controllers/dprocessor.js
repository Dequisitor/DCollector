var dprocess = angular.module("dprocess", ["mgcrea.ngStrap", "sharedServices"]);

dprocess.controller("dprocessController", function ($scope, listService, $http, $alert) {
	
	$scope.chart = null;
	$scope.data = null;

	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
	});

	$scope.getYAxis = function (data) {
		var result = [];

		for (var i=0; i<data.length; i++) {
			var current = -1;
			for (var j=0; j<result.length; j++) {
				if (result[j].title == data[i].yAxis) {
					current = j;
				}
			}

			if (current == -1) { //create new axis
				result.push({
					title: data[i].yAxis,
					opposite: result.length%2==1,
					labels: {
						format: "{value} " + data[i].yAxis
					}
				});
				current = result.length -1;
			}

			data[i].yAxis = current;
		}

		return result;
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
					yAxis: data.yAxis,
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

	$scope.createChart = function () {
		var data = $scope.filterData();
		var yAxis = $scope.getYAxis(data);
		angular.element("#chartContainer").highcharts({
			chart: {
				zoomType: "x",
				plotBorderWidth: 1
			},
			legend: {
				enabled: false
			},
			title: {
				text: $scope.selectedFile
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
			yAxis: yAxis,
			series: data
		});
	};

	$scope.drawChart = function () {
		$http.get("../../Data/" + $scope.selectedFile).success(function(json) {
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
			$scope.createChart($scope.selectedFile);
		});
	};

	$scope.changeFile = function () {
		$scope.drawChart($scope.selectedFile);
	};

});
