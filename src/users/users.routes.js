const express = require('express');
const router = express.Router();

const { validate } = require('../helpers/validate');
const { upload } = require('../services/file-upload');
const { minifyImage } = require('../services/minifyImage');
const { authorize } = require('./authorize.middleware');
const {
  signUp,
  signIn,
  logout,
  updateSubscription,
  updateAvatar,
  verificationUser,
  sendAnotherVerifyEmail,
} = require('./users.controller');
const {
  signupSchema,
  loginSchema,
  updateUserSchema,
  verifyUserSchema,
} = require('./users.schema');
const { prepareUser, prepareUserWithToken } = require('./users.serializer');

router.post(
  '/signup',
  upload.single('avatarURL'),
  validate(signupSchema),
  minifyImage,
  async (req, res, next) => {
    try {
      const user = await signUp(req.body, req.file);
      return res.status(201).send(prepareUser(user));
    } catch (err) {
      next(err);
    }
  },
);

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

router.patch(
  '/avatars',
  authorize,
  upload.single('avatarURL'),
  minifyImage,
  async (req, res, next) => {
    try {
      const updateUser = await updateAvatar(req);
      return res.status(200).send(prepareUser(updateUser));
    } catch (err) {
      next(err);
    }
  },
);

router.get('/verify/:verifyToken', async (req, res, next) => {
  try {
    await verificationUser(req.params);
    return res.status(200).send('Verification successful');
  } catch (err) {
    next(err);
  }
});

router.post('/verify', validate(verifyUserSchema), async (req, res, next) => {
  try {
    await sendAnotherVerifyEmail(req.body);
    return res.status(200).send('Verification email sent');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
