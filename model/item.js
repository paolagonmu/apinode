//item.js
/*dependecias requeirdas*/
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/**
 * crea la conexion conla base de datos en la nube de mongobd*/
mongoose.connect('mongodb://sebas:abc123@ds239703.mlab.com:39703/sebasnodejscrud',{ useMongoClient: true });

/**
 * crea el esquema para insertar en la base de datos*/
var itemSchema = new Schema ({
"itemId" : {type: String, index: {unique: true}},
"itemName": String,
"price": Number,
"currency" : String,
"categories": [String]
});

/**agrega la paginacion */
console.log('paginate');
itemSchema.plugin(mongoosePaginate);
var CatalogItem = mongoose.model('Item', itemSchema);

/**exporta el esquema de catalogo y la conexion con la base de datos */
module.exports = {CatalogItem : CatalogItem, connection : mongoose.connection};
