const express = require('express');
const keys = require('../config/keys');
const diagnosticRouter = require('./routers/diagnostic');
const exportRouter = require('./routers/export');

const app = express();
const port = keys.port || 8080;

app.use(express.json());
app.use(diagnosticRouter);
app.use(exportRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
