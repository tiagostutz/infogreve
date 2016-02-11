NoticiaGreveViewModel = function(cb) {
	var _self = this;	
    idNoticia = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/')+1));    
	$.get(apiURL + "/noticias/" + idNoticia, function(data) {
		_self.noticia = ko.observable(data);
		cb();
	});	
	$('.listagem-loading').show();
	$('.listagem').hide();
};

$(document).ready(function(){
	
	var viewModel = new NoticiaGreveViewModel(function() {
		
		ko.applyBindings(viewModel);

		$('.listagem-loading').hide();		
		$('.listagem').show();
		
	}); 
	
}); 