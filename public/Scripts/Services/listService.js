var services = angular.module('sharedServices', []);

services.service('listService', function ($http) {
	availableFiles = [];
	allEntries = [];
	currentFile = "";

	return {
		getLatestEntries: function(fn) {
			$http.get('/getLatest').success(function (data) {
				if (data.length > 0) {
					data.forEach(function (entry) {
						availableFiles.push(entry.fileName);
						allEntries[entry.fileName] = entry.data;
					});

					fn(availableFiles, allEntries);
				} else {
					fn(null, null);
				};
			});
		},
		getEntry: function(entry, fn) {
			if (allEntries[currentFile]) {
				var list = allEntries[currentFile].data;
				var index = list.indexOf(entry);

				if (index != -1) {
					fn(index);
				} else {
					fn(null);
				}
			} else {
				fn(null);
			}
		},
		addEntryToList: function(entry) {
			this.getEntry(entry, function (index) {
				if (index != null) {
					console.log('entry already exists');
				} else {
					allEntries[currentFile].data.push(entry);
				};
			});
		},
		removeEntryFromList: function(entry) {
			this.getEntry(entry, function (index) {
				if (index != null) {
					allEntries[currentFile].data.splice(index, 1);
				} else {
					console.log('entry not found');
				};
			});
		},
		setCurrentFile: function(fileName, fn) {
			if (availableFiles.indexOf(fileName) != -1) {
				currentFile = fileName;
				
				if (!allEntries[fileName]) {
					allEntries[fileName] = {};
					allEntries[fileName].data = [];
				};
				
				fn(allEntries[fileName].data);
			} else {
				fn(null);
			};
		}
	};
});
