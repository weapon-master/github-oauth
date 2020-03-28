const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const connectDB = require('../db/mongodb.js');
const {
  getUser: getUserRecord,
  createUser: createUserRecord,
  User: UserModel,
} = require('../models/user');
const cookieSession = require('cookie-session');
const authRouter = require('../routes/auth');
const userRouter = require('../routes/user');

dotenv.config({ path: path.join(__dirname, '../config/.env') });
const {
  PORT = 3000,
  NODE_ENV,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  MONGO_URI,
} = process.env;

connectDB(MONGO_URI);
passport.serializeUser((user, done) => {
  console.log('xxxx', user.id);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  let user = await UserModel.findById(id);
  done(null, user);
});
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, username } = profile;
      let existingUser = await getUserRecord(id);
      if (!existingUser) {
        existingUser = await createUserRecord({ userId: id, name: username });
      }
      done(null, existingUser);
    },
  ),
);
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

process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
