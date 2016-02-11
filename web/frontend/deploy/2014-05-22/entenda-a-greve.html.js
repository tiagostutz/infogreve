EntendaGreveViewModel = function(cb) {
	//var apiURL = "http://api.infogreve.com.br:3001";
	var apiURL = "https://stutzsolucoes-test.apigee.net/ceradv";
	var _self = this;
	_self.currentPergunta = ko.observable();
	$.get(apiURL + "/topicos/?sort_by=ordem&sort_desc=false", function(data) {
		topicosVM = data;
		$(topicosVM).each(function(idx, topico) {
			//montagem do VM das fases
			topico.isFaseReinvindicacao = false;
			topico.isFaseDeflagracao = false;
			topico.isFaseConducao = false;
			topico.isFaseEncerramento = false;
			$(topico.fase).each(function(idx, fase) {
				if (fase.id == 1) {
					topico.isFaseReinvindicacao = true;
				}else if (fase.id == 2) {
					topico.isFaseDeflagracao = true;
				}else if (fase.id == 3) {
					topico.isFaseConducao = true;
				}else if (fase.id == 4) {
					topico.isFaseEncerramento = true;
				}
			});	

			//montagem do VM das perguntas
			$(topico.perguntas).each(function(idx, pergunta) {
				pergunta.visivel = ko.observable(false);
				pergunta.carregando = ko.observable(false);
				pergunta.resposta = ko.observable('');
				pergunta.saibaMaisSolicitado = ko.observable(false);
				pergunta.saibaMaisMensagem = ko.computed(function() {
					return "Olá, eu gostaria de saber mais informações sobre \"" + pergunta.title+"\"";
				});
				pergunta.abrirSaibaMais = function() {
					var _pergunta = this;
					_pergunta.saibaMaisSolicitado(true);
				}
				pergunta.toggle = function() {
					var _pergunta = this;
					_pergunta.load(function(){
						_pergunta.carregando(false);
						_pergunta.visivel(!pergunta.visivel());
					});
				}
				pergunta.load = function (cb) {
					var _pergunta = this;
					if (_pergunta.resposta() == '') {
						_pergunta.carregando(true);
						$.get(apiURL + "/perguntas/" + _pergunta.appItemId, function(data) {
							_pergunta.resposta(data.resposta);
							cb();
						});
					}else{
						cb();
					}
				}
			});

			//recuperação das noticias vinculadas
			topico.noticias = ko.observableArray();
		});
		_self.listaTopicos = ko.observableArray(topicosVM);;
		_self.carregarNoticias = function() {
			$(_self.listaTopicos()).each(function(idx, topico){
			$.get(apiURL + "/topicos/" + topico.id + "/noticias/", function(data) {
				if (data!=null && data.length > 0) {
					$(data).each(function(idx, noticia){
						topico.noticias.push(noticia)
					});
				}
			});
		}); 
		}
		cb();
	});
	$('.topicos-listagem-loading').show();
	$('.topicos-listagem').hide();

}
$(document).ready(function(){
	//Funcoes para botao 'Voltar ao inicio'
	var offset = 220;
    var duration = 500;
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.back-to-top').fadeIn(duration);
        } else {
            jQuery('.back-to-top').fadeOut(duration);
        }
    });    
    jQuery('.back-to-top').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    });
    jQuery('select.select').change(function(event) {
        event.preventDefault();
        number = jQuery('select.select').val();
        $("html, body").delay(100).animate({scrollTop: $("#topico_" + number).offset().top }, 690);
        return false;
    });

    //ViewModel Apply
	var viewModel = new EntendaGreveViewModel(function() {
		ko.applyBindings(viewModel);
		$('.topicos-listagem-loading').hide();		
		$('.topicos-listagem').show();
		if (window.location.href.indexOf('#') != -1) {
			topicoElId = window.location.href.substring(window.location.href.indexOf('#'));
			if (topicoElId) {
				$("html, body").delay(100).animate({scrollTop: $(topicoElId).offset().top }, 690);
			}
		}
		ajaxizeForms();
		viewModel.carregarNoticias();
	}); 
});  

function createCookie(a, b, c) {
    if (c) {
        var d = new Date;
        d.setTime(d.getTime() + c * 24 * 60 * 60 * 1e3);
        var e = "; expires=" + d.toGMTString()
    } else var e = "";
    document.cookie = a + "=" + b + e + "; path=/"
}

function readCookie(a) {
    var b = a + "=";
    var c = document.cookie.split(";");
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        while (e.charAt(0) == " ") e = e.substring(1, e.length);
        if (e.indexOf(b) == 0) return e.substring(b.length, e.length)
    }
    return null
}

function eraseCookie(a) {
    createCookie(a, "", -1)
}

function saveConversion() {}

function setUtmzVal() {
    try {
        var a = readCookie("__utmz");
        $("input[type=hidden][name=c_utmz]").val(a)
    } catch (b) {}
}

function conversionSuccess(res, status, xhr, $form) {
	$('input[type=submit]',$form).addClass("button-success");
	$('input[type=submit]',$form).css("width", "250px");
	$('input[type=submit]',$form).val("Solicitação enviada com sucesso!");
}

function conversionError() {
	alert('Erro ao enviar solicitação!');   
}

function parseRDR(a) {}
function preSubmit(arr, $form, options) {
    $('input[type=submit]',$form).attr("disabled","disabled");
	$('input[type=submit]',$form).css("width", "200px");
    $('input[type=submit]',$form).val("Enviando...");
}

if (typeof console == "undefined" || typeof console.log == "undefined") var console = {
    log: function () {}
};

ajaxizeForms = function () {
    setUtmzVal();
    var d = $(".conversion-form").attr("action") + ".js";
    var e = {
        url: d,
        type: "GET",
        dataType: "script",
        beforeSubmit: preSubmit,
        success: conversionSuccess,
        error: conversionError
    };
    $(".conversion-form").ajaxForm(e)
};