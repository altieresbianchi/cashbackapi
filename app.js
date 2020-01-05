const app = require('./config/custom-express');

// Inicia o server
app.listen(3000, () => {
  console.log('server started');
});