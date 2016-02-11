NoticiasGreveViewModel = function(cb) {
	var _self = this;
        
	$.get(apiURL + "/noticias/?sort_by=data-de-publicacao&limit=20", function(data) {
		_self.listaNoticias = ko.observableArray(data);
		
		ko.utils.arrayForEach(_self.listaNoticias(), function(noticia) {
			noticia.isFaseReinvindicacao =ko.observable(false);
			noticia.isFaseDeflagracao = ko.observable(false);
			noticia.isFaseConducao = ko.observable(false);	
			noticia.isFaseEncerramento = ko.observable(false);
			noticia.tituloUrl = noticia.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
			ko.utils.arrayForEach(noticia.fase, function(fase) {
				
				if (fase.id == 1) {
					noticia.isFaseReinvindicacao(true);
				}else if (fase.id == 2) {
					noticia.isFaseDeflagracao(true);
				}else if (fase.id == 3) {
					noticia.isFaseConducao(true);
				}else if (fase.id == 4) {
					noticia.isFaseEncerramento(true);
				}
				
			});
			
			
	    });

		
		cb();
	});	
	
	$('.listagem-loading').show();
	$('.listagem').hide();
};





$(document).ready(function(){
	
	
	
	var viewModel = new NoticiasGreveViewModel(function() {
		
		this.expandeDiv = function(item, event) {
			
			var buttonName = event.target.textContent;
			var parentId ="#div_outer_"+event.target.parentNode.parentNode.id;
			var totalHeight = 80;
			
				$(parentId+' > div > p').each( function(){ totalHeight += $(this).innerHeight(); });
				$(parentId).animate({ height: totalHeight+ 'px' }, 'linear', function(){
			       });
				
			$(event.target).css('display','none');
	        
	    };
		
		ko.applyBindings(viewModel);
		$('.listagem-loading').hide();		
		$('.listagem').show();
		number = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
		if (number) {
			$("html, body").delay(100).animate({scrollTop: $("#noticia_" + number).offset().top }, 690);
		}
		
		
	});  
	
	
}); 