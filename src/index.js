import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import logger from './utils/logger';
import routes from './routes';
import config from './config';

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://mongo:27017/mongodb_tutorial');

import Book from './models/book';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
} else {
  const corsOptions = {
    origin: [
      /^https?:\/\/localhost(:[0-9]+)?\/?$/,
      /^https?:\/\/127.0.0.1(:[0-9]+)?\/?$/,
    ],
  };
  logger.info('Cors option is required');
  app.use(cors(corsOptions));
}

app.set('port', config.port);
app.use(morgan('tiny', { stream: logger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  res.status(500).send({ error: 'invalid data' });
  next(err);
});

app.use('/', routes);

app.listen(app.get('port'), () => {
  logger.info('Server log level is', logger.logLevel);
  logger.info(`Express server listening on port ${app.get('port')}`);
});
