//TO RUN: NODE_ENV=production pm2 start server
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const raiders = require("./routes/api/raiders");
const blizzard = require("./routes/api/blizzard");
const forums = require("./routes/api/forums");
const administrative = require("./routes/api/administrative");
const mainData = require("./routes/api/mainData");
const google = require("./routes/api/google");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/raiders", raiders);
app.use("/api/blizzard", blizzard);
app.use("/api/forums", forums);
app.use("/api/administrative", administrative);
app.use("/api/mainData", mainData);
app.use("/api/google", google);

// Serve static asses if in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}!`));
