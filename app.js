const express = require('express');
const app = express();
app.use(express.json());
const routers = require('./routers/index');
const customErrorHandler = require('./middlewares/errors/customErrorHandler');
const dotenv = require('dotenv').config({
    path: "./config/env/config.env"
});
const connectDatabase = require('./helpers/database/connectDatabase');

const port = process.env.PORT || 3000;

// Routers middleware
connectDatabase();

app.use("/api", routers);
app.use(customErrorHandler);

app.listen(port, () => {
    console.log(`listening on ${port} : ${process.env.NODE_ENV}`);
});