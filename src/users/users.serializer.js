function prepareUser(user) {
  return {
    email: user.email,
    subscription: user.subscription,
  };
}

function prepareUserWithToken(userWithToken) {
  return {
    user: prepareUser(userWithToken.user),
    token: userWithToken.token,
  };
}

exports.prepareUser = prepareUser;
exports.prepareUserWithToken = prepareUserWithToken;
