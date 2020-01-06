const routes = require('express').Router();
const request = require("request");
const config = require('config');

// Auth
const auth = require('../middleware/auth');

// Require routes
const revendedor = require('./revendedor');
const compra = require('./compra');

// Require controller
var loginController = require('../controllers/loginController');

//Login
routes.post('/v1/login', loginController.postLogin);

// Rotas internas
routes.use('/v1/revendedores', revendedor);
routes.use('/v1/compras', auth, compra); // Todas as rotas com autenticacao

// Cashback acumulado
routes.get('/v1/cashback/:cpf', auth, (req, res) => {
	try {
		// Pega o CPF
		var cpf = (req.params.cpf ? req.params.cpf.replace(/[^0-9]/g, '') : null);
		
		//console.log(cpf)
		//console.log(config.get('externalApiToken'))
		
		// Opcoes chamada
		const options = {
		  url: (config.get('externalApiUrl') + '?cpf=' + cpf),
		  headers: {
			  "token": config.get('externalApiToken')
		  }
		};
		
		// Chamada da API
		request.get(options, (error, response, result) => {
		    if(error) {
		        res.status(500).json({
					"statusCode": 500,
					"message": "Falha ao buscar o cashback",
					"data": error,
				});
		    }
		    
		    // Converte o resultado
		    var parsed = JSON.parse(result);
		    
		    // Seta o retorno
		    res.status(parsed.statusCode).json({
				"statusCode": parsed.statusCode,
				"message": (parsed.body.message ? parsed.body.message : "Dados retornados com sucesso"),
				"data": parsed.body,
			});
		});
		
	} catch (ex) {
	  console.error(ex);
	
	  res.status(500).json({
		"statusCode": 500,
		"message": "Não foi possível completar a solicitação",
		"data": ex.message,
	  });
	}
});

// Home
routes.get('/v1/', (req, res) => {
	res.status(200).json({
		"statusCode": 200,
		"message": "Cashback API - Teste prático.",
		"data": null,
	});
});

module.exports = routes;

