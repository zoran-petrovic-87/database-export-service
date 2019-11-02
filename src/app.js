const express = require('express');
const routerDiagnostic = require('./routers/diagnostic');
const routerExport = require('./routers/export');

const app = express();

app.use(express.json());
app.use(routerDiagnostic);
app.use(routerExport);

module.exports = app;
