export const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect("/auth/login");
};

export const isMarket = (req, res, next) => {
  if (req.session.isAuthenticated && req.session.user.role === 'market') {
    return next();
  }
  res.redirect("/");
};

export const isConsumer = (req, res, next) => {
  if (req.session.isAuthenticated && req.session.user.role === 'consumer') {
    return next();
  }
  res.redirect("/");
};
