$(function() {
	console.log("started ...");

	var getYAxis = function (list, unit) {
		var current = -1;
		for (var i=0; i<list.length; i++) {
			if (list[i].title == unit.toLowerCase()) {
				current = i;
			}
		};

		if (current == -1) { //add new unit to a new y axis
			list.push({title: unit, opposite: list.length%2==1});
			return list.length-1;
		};

		return current;
	};

	$.getJSON("../../Data/weight.json", function(json) {

		var data = [];
		var yAxis = [];
		json.forEach(function (entry) {
			for (var i=0; i<entry.data.length; i++) {
				
				//search for data slot
				var current = -1;
				for (var j=0; j<data.length; j++) {
					if (data[j].name == entry.data[i].name) {
						current = j;
					}
				}
				if (current == -1) { //add if it is new entry
					var axis = getYAxis(yAxis, entry.data[i].unit);
					data.push({name: entry.data[i].name, yAxis: axis, data: []});
					current = data.length -1;
				}

				//add data
				var date = new Date(Date.parse(entry.timeStamp.replace(/T/g, " ").replace(/Z/g,"")));
				var timeStamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
				data[current].data.push([timeStamp, entry.data[i].value]);

			}
		});

		$("#chartContainer").highcharts({
			tooltip: {
				shared: true
			},
			xAxis: {
				type: "datetime",
				title: {
					text: "Time"
				},
				tickInterval: 7*24*3600*1000,
				gridLineWidth: 1
			},
			yAxis: yAxis,
			series: data
		});

	});

});
