OQueDizALeiViewModel = function(cb) {
	var _self = this;

	_self.listaLegislacao = new Array();
	_self.listaJurisprudencia = new Array();
	_self.listaProposicoes = new Array();
	
	$.get(apiURL +"/legislativos/?limit=300&sort_by=item_id&sort_desc=false", function(data) {

		legislativosVM = data;

		$(legislativosVM).each(function(idx, item){
			//caso não tenha sido definida categoria, continua o laço
			if (item.categoria==undefined || item.categoria.length==0) {
				return true;
			}
			item.tipo = item.categoria[0].value;

			if (item.categoria[0].id ==1) { //Legislacao
				_self.listaLegislacao.push(item);

			}else if (item.categoria[0].id ==2) { //Jurisprudencia
				_self.listaJurisprudencia.push(item);

			}else if (item.categoria[0].id ==3) { // Proposicao Legislativa
				_self.listaProposicoes.push(item);
			}
			
			
		});
		_self.listaLegislacoesFiltradas = ko.observableArray();
		



		cb();
	});
	$('.listagem-loading').show();
	$('.listagem').hide();
	
	
	_self.filtrarPorCategoria = function(codigoCategoria) {
		_self.listaLegislacoesFiltradas(new Array());
		if (codigoCategoria==1) {
			$(_self.listaLegislacao).each(function(idx, legislacao){
				_self.listaLegislacoesFiltradas.push(legislacao);
			});
		}else if (codigoCategoria==2) {
			$(_self.listaJurisprudencia).each(function(idx, jurisprudencia){
				_self.listaLegislacoesFiltradas.push(jurisprudencia);
			});
		}else if (codigoCategoria==3) {
			$(_self.listaProposicoes).each(function(idx, proposicao){
				_self.listaLegislacoesFiltradas.push(proposicao);
			});
		}
	}
	Tipo = function(parentVM, _codigo, _nome, _descricao) {
		var _selfTipo = this;
		this.codigo = _codigo;
		this.nome = _nome;
		this.descricao = _descricao;
		this.selecionado = ko.observable(false); //fazer com que o primeiro item seja selecionado inicialmente
		this.selecionado.subscribe(function(newValue) { //quando o valor mudar, ele dispara o metodo que filtra a listagem de legislacoes
			if(newValue) {
				$(parentVM.tipos).each(function(idx, tipo) { //desmarcar os demais para deixar apenas o atual marcado
					if (tipo.codigo != _selfTipo.codigo) {
						tipo.selecionado(false);
					}
				});
				//filtrar pela categoria que foi selecionada
				parentVM.filtrarPorCategoria(_selfTipo.codigo);
			}
		});
		this.toggle = function() {
			_selfTipo.selecionado(!_selfTipo.selecionado());
		}
	}
	_self.tipos = [	new Tipo(_self, 1, "Legislação", "Constituição da República, Leis Federais, Convenções e Recomendações internacionais"), 
					new Tipo(_self, 2, "Jurisprudência", "Decisões judiciais e tendências de interpretações"), 
					new Tipo(_self, 3, "Proposições legislativas", "Projetos de Leis e Propostas de Emendas Constitucionais")];
}
$(document).ready(function(){
	var FilteredArray= new Array();
	var arrayCheckedFase = new Array();
	var arrayCheckedTopico = new Array();
	var viewModel = new OQueDizALeiViewModel(function() {
		
		
		
		
		ko.applyBindings(viewModel);
		
		
		this.filtraPorFaseTopico=function(cb){
			
			//verifica a categoria e seta o filteredarray 
			categoriaSelecionada = viewModel.tipos.filter(function(el){return el.selecionado()===true})[0].codigo;
			FilteredArray = legislativosVM.filter(function(el){return el.categoria.filter(function(e){return e.id==categoriaSelecionada}).length>0});	 
			
			
			
			if(cb.checked===true){
				if(cb.id.indexOf("fase")!=-1){
					arrayCheckedFase.push(cb.value);
				}
				else if(cb.id.indexOf("topico")!=-1){
					arrayCheckedTopico.push(cb.value);
				}
			}
			else{
				if(cb.id.indexOf("fase")!=-1){
					arrayCheckedFase.splice(arrayCheckedFase.indexOf(cb.value), 1);
				}
				else if(cb.id.indexOf("topico")!=-1){
					arrayCheckedTopico.splice(arrayCheckedTopico.indexOf(cb.value), 1);
				}
			}
			
			 
			 console.log("Array -"+FilteredArray.length);
			 arrayCheckedFase.forEach( function doProcess(v, i, ary) {
				 
				 FilteredArray =FilteredArray.filter(function(el){return el.fase.filter(function(e){return e.id==v}).length>0})
				 console.log("Fase -"+FilteredArray.length);
		        });
			 
			 arrayCheckedTopico.forEach( function doProcess(v, i, ary) {
				 
				 FilteredArray =FilteredArray.filter(function(el){return el.topico.filter(function(e){return e.appItemId==v}).length>0})
				 console.log("Topico -"+FilteredArray.length);
		        });

			
			 
			viewModel.listaLegislacoesFiltradas(new Array());
			viewModel.listaLegislacoesFiltradas(FilteredArray);

		};
		
		
		
		
		$('.listagem-loading').hide();		
		$('.listagem').show();
		viewModel.tipos[0].toggle();
		number = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
		
		if (window.location.href.indexOf('leis')!=-1) {
			viewModel.tipos[0].selecionado(true);
		}else if (window.location.href.indexOf('jurisprudencia')!=-1) {
			viewModel.tipos[1].selecionado(true);
		}else if (window.location.href.indexOf('proposicao')!=-1) {
			viewModel.tipos[2].selecionado(true);
		}
		if (number) {
			$("html, body").delay(100).animate({scrollTop: $("#legislacao_" + number).offset().top }, 690);
		}
	});    
}); 