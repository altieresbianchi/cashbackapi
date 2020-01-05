const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const pool = require('./pool-factory');
const connectionMiddleware = require('../src/middleware/connection');

// Middleware connect
app.use(connectionMiddleware(pool));

//Formidable
const formidableMiddleware = require('express-formidable');
app.use(formidableMiddleware());

// Rotas
const routes = require('../src/routes');

//  Connect all our routes to our application
app.use('/api/', routes);
//app.use(routes);

//middleware de tratamento de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
	res.status(500).json({ error: err.toString() });
});

module.exports = app;