const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sabha = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(sabha);
const csrf = require('csurf');
const csrfProtection = csrf();
const flash = require('connect-flash');
const app = express();
const User = require("./models/user-model")
const multer = require("multer");
const Date = require("node-datetime");
const compress = require("compression");
const dbURI = "mongodb+srv://ayar_mukho_jee1304:%4013Apr2002@cluster0.nemg4.mongodb.net/anon";
const morgan = require("morgan")

const store = new MongoDBStore({
    uri: dbURI,
    collection: 'sessions'
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname == "bgURL")
      cb(null,  "./images/background")
    else if (file.fieldname == "imgURL")
      cb(null, "./images/logo")
  },
  filename: (req, file, cb) => {
    const encodedfName = Date.create()._created + "-" + file.originalname;
    if (file.fieldname == "bgURL")
      cb(null, "b" + encodedfName);
    else if (file.fieldname = "imgURL")
      cb(null, "f" + encodedfName)
  }
})
const imgFilter = (req, file, cb) => {
  const mime = file.mimetype;
  if (mime == "image/jpeg" || mime == "image/jpg" || mime == "image/png")
    cb(null, true)
  else
    cb(null, false)
}

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(compress());
app.use(morgan("combined"))
app.use(
    sabha({
      secret: 'aazke-amar-mon-bhalo-neih',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  storage: fileStorage,
  fileFilter: imgFilter
})
  .fields([
  { name: "imgURL", maxCount: 1 },
  { name: "bgURL", maxCount: 1 }
]))
app.use(express.static(path.join(__dirname, 'public')));
app.use("/feed/images", express.static(path.join(__dirname, "images")))
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) 
    return next();
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

const feedRoute = require("./routes/feed-route");
const authRoute = require("./routes/auth-route"); 
const userRoute = require("./routes/user-route");
const channelRoute = require("./routes/channel-route");
app.use(feedRoute);
app.use(authRoute);
app.use(channelRoute);
app.use(userRoute);
app.use((req, res, next) => res.status(404).render("404", {pgTitle: "404: Can't find page"}));

mongoose.connect(dbURI).then(app.listen(3000))