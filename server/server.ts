import express, { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import session from "express-session";
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import { initPassport } from "./middleware/passport";
import logAcess from "./middleware/logUserActions";
import api from './routes/api';

const app: Express = express();
dotenv.config();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again after 15 minutes'
// });

// add others origins to the array
const allowedOrigins = [
  'http://localhost',
  'http://localhost:3000',
  'http://localhost5000',
  'http://localhost:80',
  'http://csspr.pge.parana',
  'http://csspr.pge.parana:3000',
  'http://csspr.pge.parana:5000',
  'http://csspr.pge.parana:80',
  'http://csspr.pge.parana:443',
  'https://csspr.pge.parana',
  'https://csspr.pge.parana:3000',
  'https://csspr.pge.parana:5000',
  'https://csspr.pge.parana:80'
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logAcess);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport middleware
// INSECURE - DO NOT USE IN PRODUCTION - USE A SECURE SESSION STORE INSTEAD
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 900000, // 15 minutes
    httpOnly: true,
    sameSite: 'lax'
  }
}));
initPassport(app);

// API routes
app.use('/api', api);

// catch 404
app.use(function (req: Request, res: Response, next: NextFunction) {
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // only error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

export default app;
