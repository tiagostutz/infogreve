'use strict';

var infogreveControllers = angular.module('infogreveControllers', []);
infogreveControllers
	.directive('onLastRepeat', function() { //diretiva criada para ser usada quando se quer chamar um callback ao término de uma renderização do tipo ng-repeat
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    });

infogreveControllers.controller('HomeController', ['$scope', 'Highlight',
    function($scope, Highlight){
		Highlight.query(function(response) {
				$scope.highlights = response; //recupera as ultimas noticias e popula a lista que está "bidiada" na tela e causará o redesenho
			}
		);
		$scope.$on('onRepeatLast', function(scope, element, attrs){
			$('.bxslider').bxSlider({auto:true, pause: 7000}); //depois de recuperadas as noticias de destaque, montar o carrossel com o HTML gerado
		});
}]);

infogreveControllers.controller('EntendaGreveController',
    function($scope, $http, $sce){
    	$scope.to_trusted = function(html_code) {
		    return $sce.trustAsHtml(html_code);
		}
    	$http({method: 'GET', url: 'http://api.infogreve.com.br:3001/topicos/?sort_by=created_on'})
    		.success(function(data, status, headers, config) {
    			$scope.topicos = data;
    		})
    		.error(function(data, status, headers, config) {
    		});
	}
);
