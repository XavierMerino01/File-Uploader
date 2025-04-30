const { Router } = require('express');
const userController = require('../controllers/userController');
const usersRouter = Router();
const passport = require("../config/passportConfig");
const multer = require("multer");
const upload = multer({ dest: "public/data/uploads" });

usersRouter.get("/", userController.getUserWithFolders);

usersRouter.post("/log-in", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
}));

usersRouter.get("/sign-up", (req, res) => {
    res.render("sign-up");
  });

usersRouter.post("/sign-up", userController.createNewUser);

usersRouter.post("/folders", userController.createNewFolder);

usersRouter.post("/upload", upload.single('uploaded_file'), userController.createNewFile);

usersRouter.get("/folders/:id", userController.getFolderById);

usersRouter.get("/log-out", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/"); // Or handle the error appropriately
    }
    res.redirect("/"); // Redirect to the home page after logout
  });
});


module.exports = usersRouter;