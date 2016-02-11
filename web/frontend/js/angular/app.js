'use strict';


var infoGreveApp = angular.module('infoGreveApp',
		['ngRoute','infogreveControllers','infogreveServices']);

infoGreveApp.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

infoGreveApp.config(function ($routeProvider){
	$routeProvider
	.when('/',{
		controller: 'HomeController',
		templateUrl: 'html/home.html'})
	.when('/entenda-a-greve/',{
		controller: 'EntendaGreveController',
		templateUrl: 'html/entenda-a-greve.html'})
	.when('/o-que-diz-a-lei/',{
		controller: 'OQueDizALeiController',
		templateUrl: 'html/o-que-diz-a-lei.html'})
	.when('/etapas-da-greve/',{
		controller: 'EtapasGreveController',
		templateUrl: 'html/etapas-da-greve.html'})
	.when('/emergencia/',{
		controller: 'EmergenciaController',
		templateUrl: 'emergencia.html'});
});


