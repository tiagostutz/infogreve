IndexViewModel = function(cb) {
	var _self = this;

	$.get(apiURL + "/noticias/?sort_by=data-de-publicacao&limit=5", function(data) {
		_self.destaques = ko.observableArray(data);;
		_self.currentDestaque = ko.computed(function() {
    		return _self.destaques()[3];
    	});
		cb();
	});
	$('.bxslider').hide();
	$('.bxslider-loading').show();
}
$(document).ready(function(){
	var viewModel = new IndexViewModel(function() {
		ko.applyBindings(viewModel);
		$('.bxslider').bxSlider({
			auto:true ,
            pause: 7000
		});		
		$('.bxslider').show();
		$('.bxslider-loading').hide();		
	});    
});  