const models = require('express').Router();

//Require controller modules.
var controller = require('../controllers/compraController');

// Rotas
models.get('/', controller.getList);
models.get('/:codigo', controller.getById);
models.post('/', controller.postCreate);
models.put(	'/:codigo', controller.putUpdate);
models.delete('/:codigo', controller.deleteById);

module.exports = models;