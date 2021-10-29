const express = require('express');
const router = express.Router();

const { validate } = require('../helpers/validate');
const { authorize } = require('./authorize.middleware');
const {
  signUp,
  signIn,
  logout,
  updateSubscription,
} = require('./users.controller');
const {
  signupSchema,
  loginSchema,
  updateUserSchema,
} = require('./users.schema');
const { prepareUser, prepareUserWithToken } = require('./users.serializer');

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const user = await signUp(req.body);
    return res.status(201).send(prepareUser(user));
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const user = await signIn(req.body);
    return res.status(200).send(prepareUserWithToken(user));
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authorize, async (req, res, next) => {
  try {
    const user = await logout(req.user);
    return res.status(204).send('No Content');
  } catch (err) {
    next(err);
  }
});

router.get('/current', authorize, async (req, res, next) => {
  try {
    return res.status(200).send(prepareUser(req.user));
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/',
  authorize,
  validate(updateUserSchema),
  async (req, res, next) => {
    try {
      const { user, body } = req;
      const updateUser = await updateSubscription({ user, body });
      return res.status(200).send(prepareUser(updateUser));
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
