angular.module('dprocess')
.directive('chartBlock', function() {
	return {
		restrict: 'E',
		scope: {
			chartBlock: "=",
			charts: "=",
			index: "=",
			minX: "@",
			maxX: "@"
		},
		templateUrl: "/dprocessor/views/chart-block.html",
		link: function(scope, element, attrs) {
		
		element.css("top", 10+254*scope.index);
		scope.charts.push(element);
		var chart = element.find(".chart");
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
				text: scope.chartBlock.name + " [" + scope.chartBlock.tooltip.valueSuffix + "]",
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
				min: scope.minX,
				max: scope.maxX,
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
			series: [scope.chartBlock]
		});
		console.log(Highcharts.charts.length);

		scope.collapseChart = function() {
			var index = scope.charts.indexOf(element);
			if (element.hasClass("collapsed")) {
				element.find(".chart").css("display", "block");
				element.find(".chart-header span.glyphicon-triangle-right").removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom");
				for (var i=index+1; i<scope.charts.length; i++) {
					scope.charts[i].css("top", "+=220");
				}
				element.removeClass("collapsed");
				angular.element(".chartContainer").css("height", "+=220");
			} else {
				element.find(".chart").css("display", "none");
				element.find(".chart-header span.glyphicon-triangle-bottom").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right");
				element.addClass("collapsed");
				for (var i=index+1; i<scope.charts.length; i++) {
					scope.charts[i].css("top", "-=220");
				}
				angular.element(".chartContainer").css("height", "-=220");
			}
		};

		scope.moveDown = function () {
			var index = scope.charts.indexOf(element);
			if (index < scope.charts.length-1) {
				var current = scope.charts[index];
				var next = scope.charts[index+1];
				var currentHeight = parseInt(current.css("height").replace("px",""));
				var nextHeight = parseInt(next.css("height").replace("px",""));
				current.css("top", "+="+(nextHeight+8));
				next.css("top", "-="+(currentHeight+8));

				var tmp = scope.charts[index]; 
				scope.charts[index] = scope.charts[index+1];
				scope.charts[index+1] = tmp;
			}
		};

		scope.moveUp = function () {
			var index = scope.charts.indexOf(element);
			if (index > 0) {
				var current = scope.charts[index];
				var prev = scope.charts[index-1];
				var currentHeight = parseInt(current.css("height").replace("px",""));
				var prevHeight = parseInt(prev.css("height").replace("px",""));
				current.css("top", "-="+(prevHeight+8));
				prev.css("top", "+="+(currentHeight+8));

				var tmp = scope.charts[index]; 
				scope.charts[index] = scope.charts[index-1];
				scope.charts[index-1] = tmp;
			}
		};

	}
}});
