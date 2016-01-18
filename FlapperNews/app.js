var app = angular.module('flapperNews', []);

app.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts) {
		$scope.posts = posts.posts;

		[
			{title: 'post 1', upvotes:1},
			{title: 'post 2', upvotes:2},
			{title: 'post 3', upvotes:3},
			{title: 'post 4', upvotes:4},
			{title: 'post 5', upvotes:5}
		];

		$scope.addpost = function() {
			if ( !$scope.title || $scope.title === "" ) {
				return;
			}
			console.log("dlfl");

			$scope.posts.push({
				title: $scope.title,
				upvotes: 0,
				link: $scope.link
			});

			$scope.title = "";
			$scope.link = "";
		};
		
		$scope.incrementUpvotes = function( post ) {
			post.upvotes++;
		};
	}
]);

app.factory('posts', [function() {
	var o = {
		posts: []
	};

	return 0;
}]);