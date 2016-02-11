NoticiasGreveViewModel = function(cb) {
	var _self = this;
        
	$.get(apiURL + "/noticias/?sort_by=data-de-publicacao&limit=200", function(data) {
		_self.listaNoticias = ko.observableArray(data);
		
		ko.utils.arrayForEach(_self.listaNoticias(), function(noticia) {
			noticia.tituloUrl = noticia.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
	    });

		
		cb();
	});	
	
	$('.listagem-loading').show();
	$('.listagem').hide();
};





$(document).ready(function(){
	
	
	
	var viewModel = new NoticiasGreveViewModel(function() {
		
		ko.applyBindings(viewModel);
		$('.listagem-loading').hide();		
		$('.listagem').show();
		
		
	});  
	
	
}); 