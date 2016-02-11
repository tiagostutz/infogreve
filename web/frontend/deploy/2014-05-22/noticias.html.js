NoticiasGreveViewModel = function(cb) {
	//var apiURL = "http://api.infogreve.com.br:3001";
	var apiURL = "https://stutzsolucoes-test.apigee.net/ceradv";
	var _self = this;
	$.get(apiURL + "/noticias/?sort_by=data-de-publicacao&limit=7", function(data) {
		_self.listaNoticias = ko.observableArray(data);;
		cb();
	});
	$('.listagem-loading').show();
	$('.listagem').hide();
}
$(document).ready(function(){
	var viewModel = new NoticiasGreveViewModel(function() {
		ko.applyBindings(viewModel);
		$('.listagem-loading').hide();		
		$('.listagem').show();
		number = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
		if (number) {
			$("html, body").delay(100).animate({scrollTop: $("#noticia_" + number).offset().top }, 690);
		}
	});    
}); 