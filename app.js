const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralerrors = require('./middlewares/central-errors.js');
const limiter = require('./middlewares/rate-limit');
const router = require('./routes/index');
const { MONGO_URL, PORT } = require('./config');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralerrors);
app.listen(PORT);
