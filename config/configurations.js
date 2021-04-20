module.exports = {
  globalVariables: (req, res, next) => {
    res.locals.messages = require("express-messages")(req, res);
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.isAuthenticated = req.user ? true : false;
    res.locals.user = req.user || null;
    next();
  }
}