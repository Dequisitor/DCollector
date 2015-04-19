angular.module('myApp')
.service('listService', function ($http) {
	var list = [];

	return {
		getList: function(fn) {
			if (list.length == 0) {
				$http.get('/getLatest').success(function (data) {
					if (data.length > 0) {
						list = data;
					}

					fn(list);
				});
			} else {
				fn(list);
			}
		},
		getEntry: function(name, fn) {
			this.getList(function(list) {
				for (var i=0; i<list.length && list[i].name.trim() != name.trim(); i++) {
				};

				if (i<list.length) {
					fn(i);
				} else {
					fn(null);
				};
			});
		},
		addEntryToList: function(entry) {
			this.getEntry(entry.name, function (index) {
				if (index != null) {
					console.log('entry already exists');
				} else {
					list.push(entry);
				};
			});
		},
		removeEntryFromList: function(name) {
			this.getEntry(name, function (index) {
				if (index != null) {
					list.splice(index, 1);
				} else {
					console.log('entry not found');
				};
			});
		}
	};
});
