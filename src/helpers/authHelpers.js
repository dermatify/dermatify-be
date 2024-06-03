function createUserData(
  name,
  picture,
  refreshToken,
  accessToken,
  hashedPassword,
  isActive
) {
  const userData = {
    name: name,
    picture: picture,
    refreshToken: refreshToken,
    accessToken: accessToken,
    hashedPassword: hashedPassword,
    isActive: isActive,
  };
  return userData;
}

function checkValidEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

module.exports = {
  createUserData,
  checkValidEmail,
};
