const router = require('express').Router();
const passport = require('passport');

router.get(
  '/api/github/auth',
  passport.authenticate('github', { scope: ['profile', 'email'] }),
);
router.get('/api/auth/callback', passport.authenticate('github'), (req, res) =>
  res.redirect('/'),
);
router.get('/api/logout', (req, res) => {
  req.logout();
  res.end(req.user);
});
module.exports = router;
