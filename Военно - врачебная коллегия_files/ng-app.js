var App = angular.module( 'vvk-app', [] );

App.controller( 'MainController', [ '$http', '$scope', '$window', function($http, $scope, $window){
	
	$scope.setTarget = function( target ){
		$scope.target = target;
	};
}]);
	
App.directive( 'titlePlaceholder', function( $http, $window ){
	return {
        restrict: 'A',
		scope: true,
		link: function ($scope, element, attrs) {
			$scope.url = $window.location.href;
			
			$http({ method: 'post', url: '/php/index.php', data: {action:'GetTitle', url: $scope.url, order: attrs.titlePlaceholder} }).success( function(data){
				if( data.error == 0 ){
					element.html( data.body );
				}
			});
        }
    };
});

App.directive( 'cityPlaceholder', function( $http ){
	return {
		restrict: 'A',
		scope: false,
		template: '{{city}}'
	}
});

App.directive( 'cityList', function(){
	return {
		restrict: 'A',
		scope: true,
		link: function( $scope, element, attr ){
			$.each( $(element).children(), function(){
				$(this).click( function(event){
					event.preventDefault();
					
					$('._big').removeClass('_big');

					element.parent().find('#' + event.target.getAttribute('href')).addClass('_big');
				});
			});
		}
	}
});

App.directive( 'callbackForm', function( $http, $location ){
	return{
		restrict: 'A',
		scope:true,
		link: function( $scope, element, attrs ){
			$(element).find('input.form-phone').click(function( event ){
				event.preventDefault();
				
				if( $(element).find('input.form-phone').val().length == 0 ){
					$(element).find('input.form-phone').val('+7');
				}
			});
			
			$(element).find('a.form-submit').click(function( event ){
				event.preventDefault();

				var params = {}
		    params['comment'] = $scope.target;
		    var add_params = $location.search();
		    params['name'] = $(element).find('input.form-name').val();
		    params['phone'] = $(element).find('input.form-phone').val();
		    if (params['phone']==undefined || params['phone'].trim() == "") {
		      alert('Вы не ввели телефон!');
		      return;
		    }
		    $(element).find('input.form-phone').popover('destroy');
				//$(element).find('input.form-mail').popover('destroy');
				
				$(element).find('input').removeClass('form-error');
		    params['utm_content'] = add_params['utm_content'];
		    params['utm_campaign'] = add_params['utm_campaign'];
		    params['utm_source'] = add_params['utm_source'];
		    params['utm_term'] = add_params['utm_term'];
		    params['utm_medium'] = add_params['utm_medium'];
		    $http.post("ajax-proxy", params)
		    .then(function( msg ) {
		    });
		    $(element).parent().find('.row > div.col-xs-10').removeClass('col-xs-10').addClass('col-xs-12');
				$('#call').modal('hide');
				$('#form-success').modal('show');
			});
		}
	}
});