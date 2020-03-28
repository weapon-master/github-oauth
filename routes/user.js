const router = require('express').Router();
const { createUser, getUser } = require('../models/user');
router.post('/api/user', async (req, res) => {
  console.log(req.body);
  const user = await createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

router.get('/api/user', async (req, res) => {
  console.log('log', req);
  if (!req.body || !req.body.userId) {
    res.status(400).json({
      success: false,
      data: null,
    });
    return;
  }
  const user = await getUser(req.body.userId);
  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    res.status(404).json({
      success: false,
      data: null,
    });
  }
});

router.get('/account', (req, res) => {
  if (req.user) {
    res.send(Object.keys(req));
  } else {
    res.redirect('/api/github/auth');
  }
});
module.exports = router;
