EtapasGreveViewModel = function() {
	var _self = this;

	var fases = [ 	{id:1, nome: "Reivindicação", color: "rgb(255, 247, 66)"}, 
					{id:2, nome: "Deflagração", color: "rgb(245, 136, 136)"}, 
					{id:3, nome: "Condução", color: "rgb(136, 158, 245)"}, 
					{id:4, nome: "Encerramento", color: "rgb(214, 245, 136)"} 
				];
	var aplicativos = [	{nome:"tópicos explicativos", appPath: "topicos", url: "entenda-a-greve.html#"},
						{nome:"modelos de documentos", appPath: "modelos", url: "http://materiais.cer.adv.br/modelos#"},
						{nome:"regras constitucionais e legais", appPath: "legislacao", url: "o-que-diz-a-lei.html#!/leis"},
						{nome:"julgados", appPath: "jurisprudencia", url: "o-que-diz-a-lei.html#!/jurisprudencia"},
						{nome:"projetos de leis e propostas de emendas", appPath: "proposicao", url: "o-que-diz-a-lei.html#!/proposicao"},
						{nome:"notícias", appPath: "noticias", url: "noticias.html#!"}
						];

	_self.etapas = ko.observableArray();
	$(fases).each(function() {
		
		_currEtapa = this;
		_currEtapa.aplicativos = ko.observableArray();
		_self.etapas.push(_currEtapa);
		
		$(aplicativos).each(function() {
			_currEtapa.aplicativos.push({
											identificacao : ko.observable(this), 
											lista : ko.observableArray(), 
											carregado: ko.observable(false)
										});
		});

	});

	montarListasEtapas = function(etapa, aplicativo) {
		(function(etapa, aplicativo){
			aplicativo.carregado(false);
			var apiURL = "http://api.infogreve.com.br:3001";
    		//var apiURL = "https://stutzsolucoes-test.apigee.net/ceradv";
          	$.ajax({
			    url: apiURL + "/etapas/" + etapa.id + "/" + aplicativo.identificacao().appPath.toString() + "/?limit=70",
			    type: 'GET',
			    async: true,
			    success: function(data){ 

			    	if (aplicativo.identificacao().appPath == "modelos") { //correcao do modelo para ter 'titulo' e funcionar binding
				    	$(data).each(function(ix, m){ m.titulo = m.nome });
				    }
			    	aplicativo.lista(data);
			    	aplicativo.carregado(true);
			    },
			    error: function(err) {
			        
			    }
			});
	    })(etapa, aplicativo);
		
	}
	montarEtapa = function(etapa) {
		for(var k in etapa.aplicativos()) {			
			(function(etapa, aplicativo){
				montarListasEtapas(etapa, aplicativo);
			})(etapa, etapa.aplicativos()[k]);
		}//fim for var k
	}

	_self.initialize = function() {
		$(_self.etapas()).each(function(){
			montarEtapa(this);
		});
	}

}
$(document).ready(function(){
	var viewModel = new EtapasGreveViewModel();    
	ko.applyBindings(viewModel);
	viewModel.initialize();
}); 