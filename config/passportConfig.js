const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require('./prisma');

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Specify that "email" is the username field
    async (email, password, done) => {
      try {
        console.log("attempted login with email:", email);
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;