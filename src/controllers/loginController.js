const jwt = require('jsonwebtoken');
const config = require('config');

// FUNCOES ---
function formatResult(res, code, message, data) {
	return res.status(code).json({
		"statusCode": code,
		"message": message,
		"data": data,
	});
}

/**
 * Login do revendedor.
 * @route POST /v1/login
 * @group revendedor - Operações do revendedor
 * @param {string} cpf.form.required - CPF - ex: 12345678901 (https://julio.li/b/2016/10/15/express-api-swagger/)
 * @param {string} senha.form.required - Senha
 * @returns {object} 200 - Objeto JSON com os dados do usuário.
 * @returns {Error}  401 - Login ou senha incorretos.
 * @returns {Error}  500 - Erro interno.
 */
exports.postLogin = function(req, res, next) {
	var cpf = req.fields.cpf;
	var senha = req.fields.senha;

	// console.log('Cpf: ' + cpf + ' - Senha: ' + senha);

	var query = 'SELECT cpf, nome, email, DATE_FORMAT(data_cadastro, "%Y-%m-%d %H:%m") as dataCadastro FROM revendedor WHERE cpf = ? AND senha = ?';
	
    req.connection.query(query, [cpf, senha], (err, [item]) => {
	  if(err) {
		  formatResult(res, 500, err, null);
	  
	  } else if(!item) {		  
		  formatResult(res, 401, 'Login ou senha incorretos!', null);
		  
	  } else {
		  
		// Gera o token
	    var token = jwt.sign({ cpf: cpf }, config.get('myJwtPrivateKey'), {
	       expiresIn: 900 // Expira em 15 min
	    });
		
	    // Seta o token no obj
	    item['token'] = token;
	    
	    // Result
	    formatResult(res, 200, 'Login realizado com sucesso!', item);
	  }
    });
};
