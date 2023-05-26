const passport = require('passport')
const local = require('passport-local')
const Users = require('../../dao/models/users.models')
const GithubStrategy = require('passport-github2')
const { hashPassword } = require('../../utils/cryptPassport.utils')
const { isValidPassword } = require('../../utils/cryptPassport.utils')
const { usersCreate } = require('../../dao/dbDao/users.dao')

const LocalStrategy = local.Strategy

const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age, password } = req.body

          const user = await Users.findOne({ email: username })
          if (user) {
            console.log('Usuario ya existe')
            return done(null, false)
          }

          const userInfo = {
            first_name,
            last_name,
            email,
            age,
            password: hashPassword(password),
          }

          const newUser = await usersCreate(userInfo)

          done(null, newUser)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await Users.findOne({ email: username })
          if (!user)
            return done(null, false)
          if (!isValidPassword(password, user)) {
            return done(null, false)
          }
          done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use('github',
    new GithubStrategy(
      {
        clientID: 'Iv1.a440b6539be625b5',
        clientSecret: '58a642fe9d85d108d992423fa5f58f46942d3a57',
        callbackURL: 'http://localhost:8080/api/login/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile)

          const user = await Users.findOne({ email:profile._json.email })

          if (!user) {
            const userInfo = {
              first_name: profile._json.name,
              last_name: '',
              age: 28,
              email: profile._json.email,
              password: '',
            }
            const newUser = await usersCreate(userInfo)
            return done(null, newUser)
          }

          done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((newUser, done) => {
    done(null, newUser.id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id)
    done(null, user)
  })
}

module.exports = initializePassport