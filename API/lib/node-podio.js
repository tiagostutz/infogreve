var Podio = require("podio-api");

/**
 * Method that represents a Gateway to a Podio APP and that returns all the relevant data
 */
var PodioApp = function (appName, appPodioId, appToken, desiredAttributes) {
	var _self = this;

	_self.appId = appPodioId;
	
	var settings = {
		client_id		: "infogreve",
		client_secret	: "Ft6nFFJTl2HwjaLAqMj4o6dz4Iz0SChje5U1Ob3EkPbwL02OVHVyDb3Zq08NPlZy",
		appFlow 	  	: { app_id: appPodioId, app_token: appToken }
	};

	_self.podioProxy = new Podio(settings);

	
	this.normalizeAttributeName = function(attributeName) {
		return attributeName.split("-")[0];
	}

	this.appRelevantAttributes = new Array();
	for(var i in desiredAttributes) {
		this.appRelevantAttributes.push(this.normalizeAttributeName(desiredAttributes[i]));
	}

	this.receberResultado = function(resultado){};

	this.buildObjectModelItem = function(item) {
		var resultItem = new Object();
		var attributeName = "";
		
		resultItem.id = item.item_id;
		resultItem.app_item_id = item.app_item_id;
		for(var j in item.fields) {
			attributeName = item.fields[j].external_id;
			normalizedAttributeName = _self.normalizeAttributeName(attributeName);
			if (_self.appRelevantAttributes.indexOf(normalizedAttributeName) != -1) {				
				resultItem[normalizedAttributeName] = _self.buildAttribute(item.fields[j]);
			}			
		}	
		//searches for the fields that wasnt filled but must be in the API respose
		for(var k in _self.appRelevantAttributes) {
			if (resultItem[_self.appRelevantAttributes[k]] == undefined) {
				resultItem[_self.appRelevantAttributes[k]] = null;
			}
		}

		return resultItem;
	}

	this.buildAttribute = function(field) {

		//case the value is a text
		if (field.type == "text") {
			return field.values[0].value;

		//case the value is a text
		}else if (field.type == "number") { 
			return parseFloat(field.values[0].value);
			
		//case the value is a category
		}else if (field.type == "category") {
			var arrResult = new Array();
			var arrItem = new Object();
			for (ix in field.values) {
				arrItem = new Object();
				arrItem.id = field.values[ix].value.id;
				arrItem.value = field.values[ix].value.text;
				arrResult.push(arrItem);
			}
			return arrResult;

		//case the value is a reference to another app
		}else if (field.type == "app") {
			var arrResult = new Array();
			var arrItem = new Object();
			for (ix in field.values) {
				arrItem = new Object();
				arrItem.appItemId = field.values[ix].value.app_item_id;
				arrItem.title = field.values[ix].value.title;
				arrResult.push(arrItem);
			}
			return arrResult;
		//case the value is a text
		}else if (field.type == "embed") {
			return field.values[0].embed.url;	

		}else if (field.type == "date") {
			var dataPublicacao = field.values[0].start;
			dataPublicacaoParts = dataPublicacao.split("-");
			return dataPublicacaoParts[2].substring(0,2) + '/' + dataPublicacaoParts[1] + '/' + dataPublicacaoParts[0];
		}else{
			//NOT IMPLEMENTED YET
		}
	}


	this.buildObjectModel = function(err, res){
		var result = new Array();
		
		for(var i in res.body.items) {
			result.push(_self.buildObjectModelItem(res.body.items[i]));
		}

		_self.receberResultado(result);
	}

	this.buildObjectModelSingle = function(err, res){
		
		result = _self.buildObjectModelItem(res.body);	
		_self.receberResultado(result);

	}

	_self.itemsGetItem = function(options, callback) {
		_self.receberResultado = callback;
		options.app_id = _self.appId;
		_self.podioProxy.itemsGetItem(options, _self.buildObjectModelSingle);
	};

	_self.itemsGetItemByAppItemId = function(appItemId, callback) {
		_self.receberResultado = callback;
		options = new Object();
		options.app_id = _self.appId;
		options.app_item_id = appItemId;
		_self.podioProxy.itemsGetItemByAppItemId(options, _self.buildObjectModelSingle);	
	}
	_self.itemsFilterItems = function(options, callback) {
		_self.receberResultado = callback;
		if (options==null) {
			options = new Object();
		}
		if (options.body.limit) {
			options.body.limit = parseInt(options.body.limit);
		}
		if (options.body.offset) {
			options.body.offset = parseInt(options.body.offset);
		}
		if (options.body.sort_desc) {
			options.body.sort_desc = eval(options.body.sort_desc);
		}
		options.app_id = _self.appId;
		_self.podioProxy.itemsFilterItems(options, _self.buildObjectModel);
	}

	_self.itemsAddNewItem = function(newItem, callback) {
		_self.podioProxy.itemsAddNewItem({app_id:_self.appId, body: newItem}, function(err,res) {callback(res);});			
	}

}//End PODIO APP
module.exports = PodioApp;