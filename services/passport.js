const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { getUser, createUser, User } = require('../models/user');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

passport.serializeUser((user, done) => {
  console.log('xxxx', user.id);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
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
      let existingUser = await getUser(id);
      if (!existingUser) {
        existingUser = await createUser({ userId: id, name: username });
      }
      done(null, existingUser);
    },
  ),
);
