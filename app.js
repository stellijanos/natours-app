const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//  1) GLOBAL MIDDLEWARES

//  set security HTTP Headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit requests from the same IP
const limiter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again in an hour.',
    },
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(
    express.json({
        limit: '10kb',
    }),
);

// Servinng static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
