/**
 * Created by lisheng on 15/6/20.
 */
var app = angular.module("ct", []);

app.factory('socketService', ['$rootScope', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}
}]);

app.controller('RoomCtrl', ['$scope', 'socketService', function ($scope, socketService) {
	$scope.messages = [];
	socketService.emit('getAllMessages');
	socketService.on('allMessages', function (messages) {
		$scope.messages = messages;
	});
	socketService.on('messageAdded', function (message) {
		$scope.messages.push(message);
	});
}]);

app.controller('MessageCreatorCtrl', ['$scope', 'socketService', function ($scope, socketService) {
	$scope.createMessage = function () {
		if (!$scope.newMessage) {
			return;
		} else {
			socketService.emit('createMessage', $scope.newMessage);
			$scope.newMessage = '';
		}
	}
}]);

app.directive('autoScrollToBottom', function () {
	return {
		restrict: 'AE',
		link: function (scope, ele, attrs, ctrl) {
			scope.$watch(function () {
					return ele.children.length;
				},
				function () {
					ele.animate({
						'scrollTop': ele.prop('scrollHeight')
					}, 1000);
				}
			);
		}
	}
});

app.directive('ctrlEnterBreakLine', function () {
	return {
		restrict: 'AE',
		link: function (scope, ele, attrs, ctrl) {
			var ctrlDown = false;
			ele.bind('keydown', function (ev) {
				if (ev.which === 17) {
					ctrlDown = true;
					setTimeout(function () {
						ctrlDown = false;
					}, 1000);
				}
				if (ev.which === 13) {
					if (ctrlDown) {
						scope.$apply(function () {
							scope.$eval(attrs.ctrlEnterBreakLine);
						});
						ev.preventDefault();
					}
				}
			});
		}
	};
});