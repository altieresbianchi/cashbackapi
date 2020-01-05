const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	// Pega o token da header
  var token = (req.headers['x-auth-token'] || req.headers['authorization']);
  // console.log(req.headers);
  
  if (!token) {
	  //return res.status(401).send({ auth: false, message: 'Token não informado.' });
	  return formatResult(res, 401, 'Token não informado.', null);
  }
  
  jwt.verify(token, config.get('myJwtPrivateKey'), function(err, decoded) {
    if (err) {
    	//return res.status(500).send({ auth: false, message: 'Token inválido ou expirado.' });
    	return formatResult(res, 401, 'Token inválido.', null);
    	//return formatResult(res, 401, err, null);
    }
    
    // se tudo estiver ok, salva no request para uso posterior
    req.cpf = decoded.cpf;
    next();
  });
}

function formatResult(res, code, message, data) {
	return res.status(code).json({
		"statusCode": code,
		"message": message,
		"data": data,
	});
}