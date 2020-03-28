const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const connectDB = require('../db/mongodb.js');

const cookieSession = require('cookie-session');
const authRouter = require('../routes/auth');
const userRouter = require('../routes/user');

dotenv.config({ path: path.join(__dirname, '../config/.env') });
const { PORT = 3000, MONGO_URI } = process.env;

require('../services/passport');
connectDB(MONGO_URI);

const app = express();
app.use(morgan('dev'));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 3600 * 1000,
    name: 'session',
    keys: ['key'],
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.get('/', (req, resp) => {
  console.log(req.session);
  resp.end('<h1>Hello</h1>');
});

const server = app.listen(PORT, () => {
  console.log(`server running at ${PORT} on ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', err => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
