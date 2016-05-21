import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
export default app;

app.use(express.static(process.env.STATIC_ROOT || path.join(__dirname,'..' ,'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

routes(app);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send('Invalid token');
  }
  var error = err;
  if (app.get('env') === 'production'){
    error = {};
  }
  res.status(err.status || 500);
  res.json({
    error: error.message
  });
});

