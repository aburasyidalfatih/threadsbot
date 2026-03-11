const checkAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

const checkGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
};

module.exports = { checkAuth, checkGuest };
