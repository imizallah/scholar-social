const express = require("express");
const path = require("path");
const app = express();
// app.dynamicHelpers({ messages: require('express-messages') });
const logger = require("morgan");
const mongoose = require("mongoose");
const User = require("./models/users");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const ejs = require('ejs');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

// Setup session store
const MongoStore = require("connect-mongo")(session);
 
// Configure Mongoose to Connect to MongoDB
mongoose.connect("mongodb://localhost/scholar-social-full", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Database connected successfully"))

/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup Session
app.use(cookieParser());
app.use(session({
  secret: 'oadjiweuihuh^^&768hT&^6ftftiojisa8&Uhih8s7&79^#@#!24rdYU',
  cookie: { maxAge: Date.now() + (3 * 10000) },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore ({ mongooseConnection: mongoose.connection })
}))
 

// Setup passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Setup flash messages
app.use(flash());

// Setup Global Variables
// Using Global Variables
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.isAuthenticated = req.user ? true : false;
  res.locals.user = req.user || null;
  next();
});
  
// Setup logger
app.use(logger('dev'));

/* Setup View Engine To Use EJS */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup Routes
app.get("/", (req, res) => {
  res.render("index")
});

app.get("/login", (req, res) => {
  res.render("auth/login")
});

app.get("/register", (req, res) => {
  res.render("auth/register")
});

app.post("/register", (req, res) => {
  // console.log(req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;  

  User.findOne({username: username})
    .then((user) => {
      if (user){
        req.flash("error_message", "Username taken, try another username");
        return res.redirect("/register");
      }

      User.findOne({email: email})
        .then( async (user) => {
          if (user){
            req.flash("error_message", "Email taken, try another email address");
            return res.redirect("/register");
          }

          if (password !== confirmPassword) {
            req.flash("error_message", "Your passwords do not match, please try again");
            return res.redirect("/register");
          }

          let newUser = await new User({
            username: username,
            password: password,
            email: email
          });

          await bcrypt.genSalt(10, async (error, salt) => {
            await bcrypt.hash(newUser.password, salt, async (error, hashedPassword) => {
              newUser.password = hashedPassword;


              await newUser.save()
                .then((user) => {
                  req.flash("success_message", "Registration successful, you may login");
                  return res.redirect("/login");
                })
                .catch((error) => console.log("An error occured while creating user"))


            });
          });

        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
  
});


const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

let eva = () => console.log("lalalala")
