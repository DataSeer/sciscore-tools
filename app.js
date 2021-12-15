/*
 * @prettier
 */

'use strict';

const express = require(`express`);
const app = express();
const http = require(`http`).Server(app);
const logger = require(`morgan`);
const methodOverride = require(`method-override`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const errorHandler = require(`errorhandler`);
const async = require(`async`);

const indexRouter = require(`./routes/index.js`);

const conf = require(`./conf/conf.json`);

app.disable(`x-powered-by`);
// all environments
app.set(`port`, process.env.PORT || 3200);
app.use(logger(`dev`));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ limit: `10mb`, extended: true }));

app.use(`/`, indexRouter);

module.exports = app;
