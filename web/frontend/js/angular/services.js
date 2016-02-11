'use strict';

var infogreveServices = angular.module('infogreveServices', ['ngResource']);

infogreveServices.factory('Highlight', ['$resource',
    function ($resource){
		return $resource('http://api.infogreve.com.br:3001/noticias\\/',{},
				{query: {method: 'GET', params:{sort_by: "created_on", limit: 3, offset: 0}, isArray:true}
			});
}]);