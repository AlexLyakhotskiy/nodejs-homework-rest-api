const { Conflict, Unauthorized, BadRequest } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promises: fsPromises } = require('fs');
const path = require('path');

const User = require('./users.model');

async function signUp(userCreateParams, userFile) {
  const { email, password } = userCreateParams;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Conflict(`User with email '${email}' already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 2);

  const userAvatar = {};
  if (userFile) {
    userAvatar.avatarURL = userFile.filename;
  }

  const newUser = await User.create({
    ...userCreateParams,
    ...userAvatar,
    password: hashedPassword,
  });

  return newUser;
}

async function signIn(signInParams) {
  const { email, password } = signInParams;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized('Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Unauthorized('Email or password is wrong');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  await User.findByIdAndUpdate(user._id, { token });

  return { user, token };
}

async function logout(logoutParams) {
  await User.findByIdAndUpdate(logoutParams._id, { token: null });
}

async function updateSubscription(subscriptionParams) {
  const {
    user: { _id },
    body,
  } = subscriptionParams;

  const updatedUser = await User.findByIdAndUpdate(_id, body, { new: true });
  return updatedUser;
}

async function updateAvatar({ file, user }) {
  if (!file) {
    throw new BadRequest('avatarURL is required');
  }

  if (file.filename !== user.avatarURL) {
    const avatarPath = path.join(
      __dirname,
      '../../public/avatars',
      user.avatarURL,
    );

    await fsPromises.unlink(avatarPath);
  }

  const body = { avatarURL: file.filename };

  const updatedUser = await User.findByIdAndUpdate(user._id, body, {
    new: true,
  });
  return updatedUser;
}

module.exports = {
  signUp,
  signIn,
  logout,
  updateSubscription,
  updateAvatar,
};
