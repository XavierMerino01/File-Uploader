const expressSession = require('express-session');
const passport = require("./config/passportConfig");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./config/prisma');
const express = require('express');
const path = require('node:path');
const usersRouter = require("./routes/usersRouter");


const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    expressSession({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'a santa at nasa',
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.use("/", usersRouter);

  const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Express app listenting on port ${PORT}!`));