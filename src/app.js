const express = require("express");
const compression = require("express-compression")
const cookieParser = require('cookie-parser')
const port = 8080;
//const { port } = require('./config/app.config')
const app = express();
const httpServer = require('http').createServer(app)
const {Server} = require('socket.io')
const mongoConnect = require('../db/index')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require ('passport')
const initializePassport =require('./config/passport/passport.config')
const Message = require('./models/message.models')
const logger = require('./config/logger.config')
const router = require('./routes/index')
const swaggerUiExpress = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')



app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(compression({
  brotli:{enable: true, zlib:{},}
}))
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
//swagger documentate

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: "Documentacion to AdoptMe!!! 🎁",
      description: "Endpoints to Manager Products"
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const swaggerSpecs = swaggerJSDoc(swaggerOptions)

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs))

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

//Server
httpServer.listen(port, async() => { 
  console.log(`Server listening on ${port}`);
});
const io = new Server(httpServer)

io.on('connection', socket => {
  console.log('Cliente conectado');
  Message.find().then((messages) => {
     socket.emit('old messages', messages);
   });

   socket.on('send message', (data) => {
     const message = new Message({
       user: data.user,
       message: data.message
     });
     message.save().then(() => {
       io.emit('new message', message);
     });
   });
  io.emit('mensajeServidor', 'Hola desde el servidor')
})


