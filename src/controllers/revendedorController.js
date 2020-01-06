
// FUNCOES ---
function formatResult(res, code, message, data, errors) {
	return res.status(code).json({
		"statusCode": code,
		"message": message,
		"data": data,
		"errors": errors,
	});
}

exports.getList = function(req, res) {
  var query = "SELECT cpf, nome, email, DATE_FORMAT(data_cadastro, '%Y-%m-%d %H:%m') as dataCadastro, " +
  		" DATE_FORMAT(data_atualizacao, '%Y-%m-%d %H:%m') as dataAtualizacao " +
  		" FROM revendedor ORDER BY nome";
	  
  // não me importa de onde vem a conexão, só preciso de uma conexão!
  req.connection.query(query, (err, list) => {
	  if(err) {
		  formatResult(res, 500, err, null);
	  } else if(!list) {
		  formatResult(res, 404, "Registros não encontrados", null);
	  } else {
		  formatResult(res, 200, "Dados retornados com sucesso", list);
	  }
      // não preciso me preocupar em devolver a conexão para o pool
    });
};

exports.getById = function(req, res, next) {
  // param
  var cpf = (req.params.cpf ? req.params.cpf.replace(/[^0-9]/g, '') : null);
  
  var query = "SELECT cpf, nome, email, DATE_FORMAT(data_cadastro, '%Y-%m-%d %H:%m') as dataCadastro, " +
	" DATE_FORMAT(data_atualizacao, '%Y-%m-%d %H:%m') as dataAtualizacao " +
	" FROM revendedor WHERE cpf = ?";
  
  // não me importa de onde vem a conexão, só preciso de uma conexão!
  req.connection.query(query, [cpf], (err, [item]) => {
	  if(err) {
		  formatResult(res, 500, err, null);
		  
	  } else if(!item) {
		  formatResult(res, 404, "Registro não encontrado", null);
		  
	  } else {
		  formatResult(res, 200, "Dados retornados com sucesso", item);
	  }
	  
      // não preciso me preocupar em devolver a conexão para o pool
    });
};

exports.postCreate = function(req, res, next) {
	var cpf = (req.fields.cpf ? req.fields.cpf.replace(/[^0-9]/g, '') : null);
	var nome = (req.fields.nome ? req.fields.nome : null);
	var email = (req.fields.email ? req.fields.email : null);
	var senha = (req.fields.senha ? req.fields.senha : null);

	// console.log('Nome: ' + nome + ' - Cpf: ' + cpf + ' - Email: ' + email + ' - Senha: ' + senha);
	// console.log(cpf.length)
	
	// Valida o form
	var errors = [];
	if(!cpf) {
		errors.push("Informe o CPF");
	} else if(cpf.length < 11) {
		errors.push("O CPF deve conter 11 dígitos");
	}
	if(!nome) {
		errors.push("Informe o nome completo");
	}
	if(!email) {
		errors.push("Informe o email");
	}
	if(!senha) {
		errors.push("Informe a senha");
	}
	// console.log(errors)
	
	if(errors && errors.length > 0) {
		formatResult(res, 409, 'Há dados inválidos no formulário enviado', null, errors);
		
	} else {
		var query = 'SELECT cpf FROM revendedor WHERE cpf = ?';
		
	    req.connection.query(query, [cpf], (err, [item]) => {
		  if(err) {
			  formatResult(res, 500, err, null);
		  
		  } else if(item) {
			  formatResult(res, 409, 'CPF já cadastrado', null);
			  
		  } else {
			var query = 'INSERT INTO revendedor(cpf, nome, email, senha, data_cadastro, data_atualizacao) VALUES (?, ?, ?, ?, ?, ?)';
		  	
	        var params =  [cpf, nome, email, senha, new Date(), new Date()];
	        // console.log(query);
	        
	        // não me importa de onde vem a conexão, só preciso de uma conexão!
	        req.connection.query(query, params, (err, result) => {
	      
	    	  // console.log(item)
	    	  if(err) {
	    		formatResult(res, 500, err, null);
	    	  } else {
	    	    formatResult(res, 200, 'Registro criado com sucesso', null);
	    	  }
	    	  
	          // não preciso me preocupar em devolver a conexão para o pool
	        });
		  }
	    });
	}
};

exports.putUpdate = function(req, res, next) {
	// param
	var cpf = (req.params.cpf ? req.params.cpf.replace(/[^0-9]/g, '') : null);
	
	// Campos
	var nome = (req.fields.nome ? req.fields.nome : null);
	var email = (req.fields.email ? req.fields.email : null);
	var senha = (req.fields.senha ? req.fields.senha : null);

	// console.log('Nome: ' + nome + ' - Cpf: ' + cpf + ' - Email: ' + email + ' - Senha: ' + senha);

	var query = 'SELECT cpf FROM revendedor WHERE cpf = ?';
	// var params = {cpf: cpf};
	    
	// não me importa de onde vem a conexão, só preciso de uma conexão!
	req.connection.query(query, [cpf], (err, [item]) => {
	  if(err) {
	    formatResult(res, 500, err, null);
			  
	 } else if(!item) {
	   formatResult(res, 404, "CPF não encontrado", null);
			  
	 } else {
	    // Valida o form
		var errors = [];
		if(!nome) {
			errors.push("Informe o nome completo");
		}
		if(!email) {
			errors.push("Informe o email");
		}
		if(!senha) {
			errors.push("Informe a senha");
		}
		// console.log(errors)
			
		if(errors && errors.length > 0) {
			formatResult(res, 409, 'Há dados inválidos no formulário enviado', null, errors);
				
		} else {
			var query = "UPDATE revendedor SET nome=?, email=?, senha=?, data_atualizacao=? WHERE cpf=?";
			var params =  [nome, email, senha, new Date(), cpf];
			// console.log(query);
				    
			// não me importa de onde vem a conexão, só preciso de uma conexão!
			req.connection.query(query, params, (err, result) => {
			  if(err) {
				formatResult(res, 500, err, null);
			  } else {
			    formatResult(res, 200, "Registro atualizado com sucesso", null);
			  }
		    });
		}
	  }
  });
};

exports.deleteById = function(req, res, next) {
  // param
  var cpf = (req.params.cpf ? req.params.cpf.replace(/[^0-9]/g, '') : null);
  
  //console.log('Request cpf:', cpf);
	
  var query = 'DELETE FROM revendedor WHERE cpf = ?';
  // var params = {cpf: cpf};
  console.log(query);
  
  // não me importa de onde vem a conexão, só preciso de uma conexão!
  req.connection.query(query, [cpf], (err, result) => {
  
	  // console.log(item)
	  if(err) {
		formatResult(res, 500, err, null);
	  } else {
	    formatResult(res, 200, "Registro excluído com sucesso", null);
	  }
      
      // não preciso me preocupar em devolver a conexão para o pool
    });
};
