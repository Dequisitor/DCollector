var dprocess = angular.module("dprocess", ["mgcrea.ngStrap", "sharedServices"]);

dprocess.controller("dprocessController", function ($scope, listService, $http, $alert) {
	
	$scope.chart = null;
	$scope.data = null;
	$scope.avgData = null;

	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
	});

	$scope.filterData = function (input) {
		var result = [];

		input.forEach(function (data) {
			if (data.visible) {
				result.push({
					name: data.name, 
					yAxis: data.yAxis,
					data: data.data,
					type: data.type,
					color: data.color,
					fillOpacity: 0.3,
					tooltip: data.tooltip,
					dashStyle: data.dashStyle ? data.dashStyle : "Solid",
					negativeColor: data.negativeColor ? data.negativeColor : null,
					lineWidth: data.lineWidth ? data.lineWidth : 2
				});
			};
		});

		return result;
	};

	$scope.createChart = function () {
		//var data = $scope.filterData($scope.data);
		var data = $scope.data;

		//destroy previous charts
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
					text: entry.name + "[" + entry.tooltip.valueSuffix + "]",
					align: "left",
					style: {
						fontSize: '14px'
					}
				},
				plotOptions: {
					series: {
						allowPointSelect: true,
						marker: {
							enabled: false
						},
						states: {
							hover: {
								lineWidthPlus: 0
							}
						},
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
											series.data[j].select();
										}
									}
								}
							}
						}
					}
				},
				tooltip: {
					//crosshairs: true,
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
					gridLineWidth: 1
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
				lineWidth: 1,
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
