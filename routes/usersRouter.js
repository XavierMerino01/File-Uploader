const { Router } = require('express');
const userController = require('../controllers/userController');
const usersRouter = Router();
const passport = require("../config/passportConfig");

usersRouter.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

usersRouter.post("/log-in", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
}));

usersRouter.get("/sign-up", (req, res) => {
    res.render("sign-up");
  });

usersRouter.post("/sign-up", userController.createNewUser);



module.exports = usersRouter;