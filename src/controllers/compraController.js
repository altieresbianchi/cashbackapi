var moment = require('moment');

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
	var query = "SELECT codigo, cpf, valor, porcentagem, "
		  + " ((valor * porcentagem) / 100) AS cashback, "
		  + " status, IF(status = 1, 'Aprovado', 'Em validação') AS statusDesc, "
		  +	" DATE_FORMAT(data_compra, '%Y-%m-%d') as dataCompra, "
		  + " DATE_FORMAT(data_atualizacao, '%Y-%m-%d %H:%i') as dataAtualizacao "
		  + " FROM compra ORDER BY data_compra DESC ";
	  
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
  var codigo = req.params.codigo;
  
  console.log('Request codigo:', codigo);
  // res.send('Request Id:', req.params.id)
	
  var query = "SELECT codigo, cpf, valor, porcentagem, "
	  + " ((valor * porcentagem) / 100) AS cashback, "
	  + " status, IF(status = 1, 'Aprovado', 'Em validação') AS statusDesc, "
	  +	" DATE_FORMAT(data_compra, '%Y-%m-%d') as dataCompra, "
	  + " DATE_FORMAT(data_atualizacao, '%Y-%m-%d %H:%i') as dataAtualizacao "
      + " FROM compra WHERE codigo = ? ";
    
  // não me importa de onde vem a conexão, só preciso de uma conexão!
  req.connection.query(query, [codigo], (err, [item]) => {
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
	var codigo = (req.fields.codigo ? req.fields.codigo : null);
	var cpf = (req.fields.cpf ? req.fields.cpf.replace(/[^0-9]/g, '') : null);
	var valor = (req.fields.valor ? req.fields.valor : null);
	var data = (req.fields.data ? req.fields.data : null);
	var status = 0; // Em validacao
	
	// Valida o CPF
	if(cpf == '15350946056') {
		status = 1; // Aprovado
	}
	
	// console.log(cpf);
	
	/*
	Rota para cadastrar uma nova compra exigindo no mínimo 
	
	código, 
	valor, 
	data e 
	CPF do
		revendedor(a). 
		
		Todos os cadastros são salvos com o status “Em validação” exceto quando o
		CPF do revendedor(a) for 153.509.460-56, neste caso o status é salvo como “Aprovado”;
	*/
	
	// console.log('Codigo: ' + codigo + ' - Cpf: ' + cpf + ' - Valor: ' + valor + ' - Data: ' + data);

	// Valida o form
	var errors = [];
	if(!codigo) {
		errors.push("Informe o código da compra");
	}
	if(!cpf) {
		errors.push("Informe o CPF do revendedor");
	} else if(cpf.length < 11) {
		errors.push("O CPF deve conter 11 dígitos");
	}
	if(!valor) {
		errors.push("Informe o valor da compra");
	}
	if(!data) {
		errors.push("Informe a data da compra");
	}
	if(!moment(data, "YYYY-MM-DD", true).isValid()) {
		errors.push("Data da compra inválida. O formato deve ser AAAA-MM-DD.");
	}
	
	if(errors && errors.length > 0) {
		formatResult(res, 409, 'Há dados inválidos no formulário enviado', null, errors);
		
	} else {
		var query = 'SELECT cpf FROM revendedor WHERE cpf = ?';
		
		req.connection.query(query, [cpf], (err, [result]) => {
		  if(err) {
			  formatResult(res, 500, err, null);
			  
		  } else if(!result) {
			  formatResult(res, 404, 'Revendedor não encontrado', null);
			  
		  } else {
			var query = 'SELECT codigo FROM compra WHERE codigo = ?';
				
			req.connection.query(query, [codigo], (err, [item]) => {
			  if(err) {
				  formatResult(res, 500, err, null);
			  
			  } else if(item) {
				  formatResult(res, 409, 'Compra já cadastrada', null);
				  
			  } else {
				var query = 'SELECT SUM(valor) as valor FROM compra WHERE cpf = ? ';
				//console.log('query: ' + query)
					
				req.connection.query(query, [cpf], (err, [result]) => {
				  if(err) {
					  formatResult(res, 500, err, null);
					  
				  } else {
					  // Calcula a porcentagem
					  var porcentagem = 10;
					  if(result.valor) {
						  if(result.valor > 1000 && result.valor <= 1500 ) {
							  porcentagem = 15;
						  } else if(result.valor > 15000) {
							  porcentagem = 20;					  
						  }
					  }
					  console.log('Valor: ' + result.valor + ' - %: ' + porcentagem);
					  
					  var query = 'INSERT INTO compra (codigo, cpf, valor, porcentagem, status, data_compra, data_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?)';
					  var params =  [codigo, cpf, valor, porcentagem, status, data, new Date()];
			          // console.log(query);
			        
			          req.connection.query(query, params, (err, result) => {
			      
			    	    // console.log(item)
			    	    if(err) {
			    		  formatResult(res, 500, err, null);
			    	    } else {
			    	      formatResult(res, 200, 'Compra cadastrada com sucesso', null);
			    	    }
			          });
					  
					  //return result;
				  }
				});
			  }
		    });  
		  }
		});
	}
};

exports.putUpdate = function(req, res, next) {
  // param
  var codigo = (req.params.codigo ? req.params.codigo : null);
  
  // Dados
  var valor = (req.fields.valor ? req.fields.valor : null);
  var status = (req.fields.status ? (req.fields.status > 0 ? 1 : 0) : null);
  var data = (req.fields.data ? req.fields.data : null);
  
  //Valida o form
  var errors = [];
  if(!valor) {
	errors.push("Informe o valor da compra");
  }
  if(status == null) {
	errors.push("Informe o status da compra");
  }
  if(!data) {
	errors.push("Informe a data da compra");
  }
  if(!moment(data, "YYYY-MM-DD", true).isValid()) {
	errors.push("Data da compra inválida. O formato deve ser AAAA-MM-DD.");
  }
	
  if(errors && errors.length > 0) {
	formatResult(res, 409, 'Há dados inválidos no formulário enviado', null, errors);
		
  } else {
	  var query = 'SELECT cpf, status FROM compra WHERE codigo = ? ';
	    
	  // não me importa de onde vem a conexão, só preciso de uma conexão!
	  req.connection.query(query, [codigo], (err, [result]) => {
		  if(err) {
			  formatResult(res, 500, err, null);
			  
		  } else if(!result) {
			  formatResult(res, 404, "Registro não encontrado", null);
			  
		  } else if(result.status == 1) {
			  formatResult(res, 403, "Não é permitido alterar uma compra já aprovada", null);
			  
		  } else {
			var query = 'SELECT SUM(valor) as valor FROM compra WHERE cpf = ? ';
			//console.log('query: ' + query)
				
			// não me importa de onde vem a conexão, só preciso de uma conexão!
			req.connection.query(query, [result.cpf], (err, [result]) => {
			  if(err) {
				  formatResult(res, 500, err, null);
				  
			  } else {
				  // Calcula a porcentagem
				  var porcentagem = 10;
				  if(result.valor) {
					  if(result.valor > 1000 && result.valor <= 1500 ) {
						  porcentagem = 15;
					  } else if(result.valor > 15000) {
						  porcentagem = 20;					  
					  }
				  }
				  console.log('Valor: ' + result.valor + ' - %: ' + porcentagem);
		  
				  var query = "UPDATE compra SET valor=?, status=?, porcentagem=?, data_compra=?, data_atualizacao=? WHERE codigo=?";
				  var params =  [valor, status, porcentagem, data, new Date(), codigo];
				  //console.log(query);
				    
				  req.connection.query(query, params, (err, result) => {
					// console.log(item)
					if(err) {
					  formatResult(res, 500, err, null);
					} else {
					  formatResult(res, 200, "Registro atualizado com sucesso", null);
					}
				 });
		       }
			});
		  }
	  });
	}
};

exports.deleteById = function(req, res, next) {
  // param
  var codigo = req.params.codigo;
  console.log('Delete codigo:', codigo);
  
  var query = 'SELECT status FROM compra WHERE codigo = ? ';
    
  // não me importa de onde vem a conexão, só preciso de uma conexão!
  req.connection.query(query, [codigo], (err, [result]) => {
	  if(err) {
		  formatResult(res, 500, err, null);
		  
	  } else if(!result) {
		  formatResult(res, 404, "Registro não encontrado", null);
		  
	  } else if(result.status == 1) {
		  formatResult(res, 403, "Não é permitido excluir uma compra já aprovada", null);
		  
	  } else {
		  var query = 'DELETE FROM compra WHERE status = 0 AND codigo = ?';
		  
		  req.connection.query(query, [codigo], (err, result) => {
			  if(err) {
				formatResult(res, 500, err, null);
			  } else {
			    formatResult(res, 200, "Registro excluído com sucesso", null);
			  }
	      });
	  }
	  
    // não preciso me preocupar em devolver a conexão para o pool
  });
};
