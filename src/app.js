const express = require("express");
const cookieParser = require('cookie-parser')
const port = 8080;
const app = express();
const mongoConnect = require('../db/index')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require ('passport')
const initializePassport =require('./config/password/passport.config')
const router = require('./routes/index')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
const{dbAdmin,dbPassword,dbHost,dbName}= require('./config/db.config')
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
      `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: false,
  })
)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
//parametros handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')

mongoConnect ()
router(app)

app.listen(port, async() => { 
   console.log(`Server listening on ${port}`);
});


