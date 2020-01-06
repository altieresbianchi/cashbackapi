const app = require('./config/custom-express');

// Inicia o server
var porta = process.env.PORT || 8080;
app.listen(porta, () => {
  console.log('server started');
});