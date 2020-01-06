const app = require('./config/custom-express');

/*
const expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'API Chasback - Teste prático',
            title: 'Swagger',
            version: '1.0.0',
        },
        //host: 'localhost:8080',
        host: 'cashbackapi.herokuapp.com',
        basePath: '/api/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
		securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./src/routes/*.js', './src/controllers/*.js'] //Path to the API handle folder
};
expressSwagger(options)
*/

// Inicia o server
var porta = process.env.PORT || 8080;
app.listen(porta, () => {
  console.log('server started');
});