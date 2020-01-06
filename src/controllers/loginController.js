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
