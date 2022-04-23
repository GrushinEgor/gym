(function () {
	'use strict';
	var app = angular.module('app', ['ui.bootstrap']);


	app.controller('MainCtrl', [ 
		'$scope', 
		'$http',
		'$timeout',
		'$uibModal',
		function ($scope, $http, $timeout, $uibModal) {
			$scope.startPageShowed = true;
			$scope.startPageFading = false;

			$scope.closeStartPage = function (argument) {
				$scope.startPageFading = true;
				$timeout(function(){
					$scope.startPageShowed = false;
				}, 2000);
			}


			$scope.progress = 0;
			$scope.startAnimation = function() {
				var ticker = function() {
					$scope.progress += 10;
					if ($scope.progress >= 100){
						$scope.progress = 100;
					}
					if ($scope.progress < 100) {
						$timeout(ticker, 100)
					}
				}

				$timeout(ticker, 100)
			}
			$scope.startAnimation();

			var images1 = [
			{
				src: 'static/img/gallery/1.jpg'
			},
			{
				src: 'static/img/gallery/2.jpg'
			}];
			var images2 = [
			{
				src: 'static/img/gallery/3.jpg'
			},
			{
				src: 'static/img/gallery/4.jpg'
			}];


			$scope.galleryDialog = {
				animation: true,
				templateUrl: 'gallery-dialog-tmpl',
				controller: 'GalleryDialogCtrl',
				size: "sm",
				resolve: {
					images: function () {
						return images1;	
					}
				}
			};
			$scope.partnersGalleryDialog = {
				animation: true,
				templateUrl: 'gallery-dialog-tmpl',
				controller: 'GalleryDialogCtrl',
				size: "sm",
				resolve: {
					images: function () {
						return images2;	
					}
				}
			};


			$scope.showGallery = function () {
				$uibModal.open($scope.galleryDialog);
			}
			$scope.showPartnersGallery = function () {
				$uibModal.open($scope.partnersGalleryDialog);
			}
		}]);
app.controller('GalleryDialogCtrl', [ 
	'$scope', 
	'$http',
	'$uibModalInstance',
	'images',
	function ($scope, $http, $uibModalInstance, images) {
		$scope.images = images;

	}]);


app
.directive('gallery', ['$document', function($document) {
	return {
		restrict: 'E',
		template: 	'<div class="gallery">'+
		'<div class="gallery__viewport">'+
		'<img ng-src="{{currentImage.src}}" class="gallery__img" ng-click="next();">'+
		'</div>'+
		'<div class="gallery__buttons">'+
		'<div class="gallery__button-prev" ng-click="prev();">'+
		'<i class="ic--arrow-left"></i>'+
		'</div>'+
		'<div class="gallery__button-next" ng-click="next();">'+
		'<i class="ic--arrow-right"></i>'+
		'</div>'+
		'</div>'+
		'</div>',
		link: function(scope, element, attr) {
			$document.on('keydown', keydown);

			function keydown(event) {
				var key = event.keyCode;
				if (key == '37'){
					scope.prev();
					scope.$apply();
					event.preventDefault();
				}
				if (key == '39'){
					scope.next();
					scope.$apply();
					event.preventDefault();
				}

			};


			scope.$on('$destroy', function() {
				$document.off('keydown', keydown);
			});
		}, 


		replace: true,
		scope: {
			images: '=images'
		},
		controller: ['$scope', function($scope) {

			$scope.prev = function () {
				$scope.index = ($scope.index > 0) ? --$scope.index : $scope.images.length - 1;
				$scope.changeImage();

			};

			$scope.next = function () {
				$scope.index = ($scope.index < $scope.images.length - 1) ? ++$scope.index : 0;
				$scope.changeImage();
			};

			$scope.changeImage = function () {

				$scope.currentImage = $scope.images[$scope.index ];
			}


			$scope.index = 0;
			$scope.changeImage();


		}]
	};
}]);



})();