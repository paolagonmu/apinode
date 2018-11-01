//catalogV.js
/* Declaracion de constantes que se utilizan para requerir los modulos de node*/
const model = require('../model/item.js');
const CatalogItem = model.CatalogItem;
const contentTypeJson = {
	'Content-Type' : 'application/json'
};
const contentTypePlainText = {
	'Content-Type' : 'text/plain'
};

/**
 * funcion para consultar todos los items*/
exports.findAllItems = function (response) {
	CatalogItem.find({}, (error, result) => {
		if (error) {
			console.error(error);
			return null;
		}
		if (result != null) {
			response.json(result);
		} else {
      response.json({});
    }
	});
};

/**
 * funcion para consultar un solo item por el id */
exports.findItemById = function (itemId, response) {
	CatalogItem.findOne({itemId: itemId}, function(error, result) {
		if (error) {
			console.error(error);
  		  response.writeHead(500,	contentTypePlainText);
			return;
		} else {
			if (!result) {
				if (response != null) {
					response.writeHead(404, contentTypePlainText);
					response.end('Not Found');
				}
				return;
			}
			if (response != null){
				response.setHeader('Content-Type', 'application/json');
				response.send(result);
			}
			console.log(result);
		}
	});
};

/**
 * funcion para consultar la categoria*/
exports.findItemsByCategory = function (category, response) {
	CatalogItem.find({categories: category}, function(error, result) {
		if (error) {
			console.error(error);
  		  response.writeHead(500,	contentTypePlainText);
			return;
		} else {
			if (!result) {
			if (response != null) {
				response.writeHead(404, contentTypePlainText);
				response.end('Not Found');
				}
				return;
			}
		if(response != null){
		 response.setHeader('Content-Type', 'application/json');
		 response.send(result);
		}
		console.log(result);
		}
	});
}

/**
 * almacena los items en la base de datos Si un artículo existe, se actualiza. De lo contrario, se crea uno nuevo.*/
exports.saveItem = function(request, response)
{var item = toItem(request.body);
	item.save((error) => {
		if (!error) {
		 item.save();
			response.setHeader('Location', request.get('host') + '/item/' + item.itemId);
			response.writeHead(201, contentTypeJson);
			response.end(JSON.stringify(request.body));
		} else {
			console.log(error);
			CatalogItem.findOne({itemId : item.itemId	},
			(error, result) => {
			console.log('Check if such an item exists');
			   if (error) {
				 console.log(error);
				 response.writeHead(500, contentTypePlainText);
				 response.end('Internal Server Error');
			} else {
			  if (!result) {
				console.log('Item does not exist. Creating a new one');
				item.save();
				response.writeHead(201, contentTypeJson);
				response.end(JSON.stringify(request.body));
			 } else {
			 console.log('Updating existing item');
			 result.itemId = item.itemId;
			 result.itemName = item.itemName;
			 result.price = item.price;
			 result.currency = item.currency;
			 result.categories = item.categories;
			 result.save();
			 response.json(JSON.stringify(result));
			}
		}
	 });
	}
 });
};

/**
 * elimina los items en la base de datos */
exports.remove = function (request, response) {
	console.log('Deleting item with id: '	+ request.body.itemId);
	CatalogItem.findOne({itemId: request.params.itemId}, function(error, data) {
		if (error) {
		  console.log(error);
		  if (response != null) {
				response.writeHead(500, contentTypePlainText);
				response.end('Internal server error');
			}
			return;
		} else {
			if (!data) {
				console.log('Item not found');
			if (response != null) {
				response.writeHead(404, contentTypePlainText);
				response.end('Not Found');
				}
				return;
			} else {
				data.remove(function(error){
				 if (!error) {
				  data.remove();
				  response.json({'Status': 'Successfully deleted'});
					}
			  else {
			   console.log(error);
			   response.writeHead(500, contentTypePlainText);
			   response.end('Internal Server Error');
			}
		});
	 }
	}
});
}
 
/**
 * La función toItem () convierte la carga útil JSON en una instancia del modelo CatalogItem, es decir, un documento de artículo
 */
function toItem(body) {
	return new CatalogItem({
		itemId: body.itemId,
		itemName: body.itemName,
		price: body.price,
		currency: body.currency,
		categories: body.categories
	});
}
