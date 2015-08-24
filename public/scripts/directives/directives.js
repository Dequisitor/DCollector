angular.module('myApp')
.directive('clickSelect', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.on('click', function() {
				this.select()
			});
		}
	}
});