require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const config = require('./config/db');
const ejs= require('ejs');
const engine=require('ejs-mate');
const passport=require('passport');
const passportlocal=require('passport-local');
const flash = require('connect-flash');
const session=require('express-session');

//passport config
require('./config/passport')(passport);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI||process.env.DB_URL);
let db = mongoose.connection;

db.on('open', () => {
  console.log('Connected to the database.');
});

db.on('error', (err) => {
  console.log(`Database error: ${err}`);
});
//images css & js means public path defined here for using static request
const app = express();
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//////////////////////////////////////////////////////

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
app.engine('ejs',engine);
app.set('view engine','ejs');

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

/////////////passport initialize/////////////
app.use(passport.initialize());
app.use(passport.session());

///////////////end here/////////////////////


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//>--------------------routes defined here-----------------------<
app.use(require('./routes/main'));
app.use('/user',require('./routes/user'));

/* Admin routes
const adminRouter = require('./routes/admin');
app.use('/admin',adminRouter);*/
//>--------------routes ended here-----------------------------------<



const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});