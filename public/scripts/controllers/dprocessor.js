var dprocess = angular.module("dprocess", ["mgcrea.ngStrap", "sharedServices"]);

dprocess.controller("dprocessController", function ($scope, listService, $http, $alert) {
	
	$scope.chart = null;
	$scope.data = null;
	$scope.minX = null;
	$scope.maxX = null;

	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
	});

	$scope.createChart = function () {
		//var data = $scope.filterData($scope.data);
		var data = $scope.data;

		//destroy previous charts
		$scope.minX = null;
		$scope.maxX = null;
		for (var i=Highcharts.charts.length-1; i>=0; i--) {
			if (!Highcharts.charts[i]) {
				continue;
			}
			Highcharts.charts[i].destroy();
		}
		angular.element("#chartContainer").empty();

		//create new charts
		data.forEach(function (entry) {
			var chart = angular.element("<div class='chart'></div>");
			angular.element("#chartContainer").append(chart);
			chart.highcharts({
				chart: {
					//zoomType: "x",
				},
				legend: {
					enabled: false
				},
				credits: {
					enabled: false
				},
				title: {
					text: entry.name + " [" + entry.tooltip.valueSuffix + "]",
					align: "left",
					style: {
						fontSize: '14px'
					}
				},
				plotOptions: {
					series: {
						allowPointSelect: true,
						point: {
							events: {
								mouseOver: function (e) {
									for (var i=0; i<Highcharts.charts.length; i++) {
										var chart = Highcharts.charts[i];
										if (!chart) {
											continue;
										}

										var series = chart.series[0];
										for (var j=0; j<series.data.length && series.data[j].x < this.x; j++) {
										}

										if (j < series.data.length) {
											chart.tooltip.refresh(series.points[j]);
											chart.xAxis[0].removePlotLine('crosshair');
											chart.xAxis[0].addPlotLine({
												id: 'crosshair',
												color: 'rgba(100, 100, 100, 0.8)',
												width: 1,
												value: series.points[j].x,
												zIndex: 3
											});
											var old = chart.hoverPoint;
											if (old) {
												old.setState();
											}
											series.data[j].setState("hover");
											chart.hoverPoint = series.data[j];
										}
									}
								}
							}
						}
					}
				},
				tooltip: {
					valueDecimals: 2,
					positioner: function () {
						return { x: this.chart.chartWidth - this.label.width, y: -1 };
					},
					shadow: false,
					borderWidth: 0,
					backgroundColor: 'rgba(255, 255, 255, 0.0)'
				},
				xAxis: {
					type: "datetime",
					minRange: 24*3600*1000,
					tickInterval: 7*24*3600*1000,
					gridLineWidth: 1,
					min: $scope.minX,
					max: $scope.maxX,
					dateTimeLabelFormats: {
						day: "%d.%m",
						week: "%d.%m",
						month: "%d.%m"
					}
				},
				yAxis: [{
					title: {
						text: null,
					}
				}],
				series: [entry]
			});
		});
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

//	$scope.synchronizeChartPosition = function (e) {
//		for (var i=0; i<Highcharts.charts.length; i++) {
//			var chart = Highcharts.charts[i];
//			e = chart.pointer.normalize(e);
//			var point = chart.series[0].searchPoint(e, true);
//
//			if (point) {
//				point.onMouseOver();
//				chart.tooltip.refresh(point);
//				chart.xAxis[0].drawCrosshair(e, point);
//			}
//		}
//	}
});
