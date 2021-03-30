const express = require("express");
const path = require("path");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const User = require("./models/users");
const bcrypt = require("bcryptjs");


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

  if (password !== confirmPassword) {
    return console.log("Your password do not match");
  }

  User.findOne({username: username})
    .then((user) => {
      if (user){
        return console.log("Username taken");
      }

      User.findOne({email: email})
        .then( async (user) => {
          if (user){
            return console.log("Email taken");
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
                  console.log("Registration successful!!!")
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
app.listen(port, () => console.log(`Server started on port ${port}`))