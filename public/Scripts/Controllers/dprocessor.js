var dprocess = angular.module("dprocess", ["mgcrea.ngStrap", "sharedServices"]);

dprocess.controller("dprocessController", function ($scope, listService, $http, $alert) {
	
	//load entries
	listService.getLatestEntries(function (files, entries) {
		$scope.availableFiles = files;
	});

	$scope.getYAxis = function (list, unit) {
		var current = -1;
		for (var i=0; i<list.length; i++) {
			if (list[i].title == unit.toLowerCase()) {
				current = i;
			}
		};

		if (current == -1) { //add new unit to a new y axis
			list.push({
               title: unit,
               labels: {
                        format: "{value} " + unit
                },
				opposite: list.length%2==1
			});
			return list.length-1;
		};

		return current;
	};

	$scope.getDataSlot = function (data, entry, yAxis) {
		var current = -1;
		for (var j=0; j<data.length; j++) {
			if (data[j].name == entry.name) {
				current = j;
			}
		}
		if (current == -1) { //add if it is new entry
			var axis = $scope.getYAxis(yAxis, entry.unit);
			data.push({
                type: "spline",
				name: entry.name, 
				yAxis: axis,
				tooltip: {
					valueSuffix: entry.unit
				},
				data: []});
			current = data.length -1;
		}

		return current;
	};

	$scope.createChart = function (data, yAxis, fileName) {
        angular.element("#chartContainer").highcharts({
            chart: {
                zoomType: "x",
                plotBorderWidth: 1
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
            yAxis: yAxis,
            series: data
        });		
	};

	$scope.drawChart = function (fileName) {
		$http.get("../../Data/" + fileName).success(function(json) {
			var data = [];
			var yAxis = [];
			json.forEach(function (entry) {
				for (var i=0; i<entry.data.length; i++) {
					if (!!entry.data[i].unit) {
						//search for data slot
						var current = $scope.getDataSlot(data, entry.data[i], yAxis);

						//add data
						var date = new Date(Date.parse(entry.timeStamp.replace(/Z/g,"")));
						var timeStamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
						data[current].data.push([timeStamp, entry.data[i].value]);
					}
				}
			});
			$scope.createChart(data, yAxis, fileName);
		});
	};

	$scope.changeFile = function () {
		$scope.drawChart($scope.selectedFile);
	};

});
