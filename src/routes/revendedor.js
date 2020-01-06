const models = require('express').Router();

// Auth
const auth = require('../middleware/auth');

// Require controller
var controller = require('../controllers/revendedorController');

// Rotas
models.post('/', controller.postCreate); // Sem autenticacao
models.get('/', auth, controller.getList);
models.get('/:cpf', auth, controller.getById);
models.get('/:cpf/cashback', auth, controller.getCashback);
models.put(	'/:cpf', auth, controller.putUpdate);
models.delete('/:cpf', auth, controller.deleteById);

module.exports = models;