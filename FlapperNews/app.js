var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts) {
		$scope.posts = posts.posts;

		$scope.addpost = function() {
			if ( !$scope.title || $scope.title === "" ) {
				return;
			}
			
			$scope.posts.push({
				title: $scope.title,
				upvotes: 0,
				link: $scope.link,
				comments: [
				{author: 'bhendi', body: 'mast chutiyap!!', upvotes: 0},
				{author: 'bhendu', body: 'kya bakchodi hai', upvotes: 0}
				]
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

app.config(['$stateProvider',
	'$urlRouteProvider',
	function ($stateProvider, $urlRouteProvider) {
		$stateProvider
			.state('home'{
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			});

		$urlRouteProvider.otherwise('home');
	}

	.state('posts'{
		url: '/posts/{id}',
		templateUrl: '/posts.html',
		controller: 'PostsCtrl'
	});

]);	

app.controller('PostsCtrl', [
	'$scope',
	'posts',
	'$stateParams'
	function ( $stateParams, posts, $scope ) {
		$scope.post = posts.posts[$stateParams.id];

		
		$scope.addComment = function() {
			if ( $scope.body === '') {
				return ;
			}

			$scope.post.comments.push({
				body: $scope.body,
				upvotes: 0,
				author: 'user'
			});

			$scope.body = '';
		};
	};
]);