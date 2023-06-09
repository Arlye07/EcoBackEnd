const {Router} = require('express')
const router = Router()

const passport = require('passport')
const UserDTO = require('../DTO/users.dto')


router.get('/', (req, res) => {
  try {
    if (req.session && req.session.user) {
      //const session = req.session
      const userSession = req.session.user
      const UserDTO = new UserDTO(
        userSession
      )
      return res.status(200).json(UserDTO)
    }
      return res.json({message: 'Usuario no autenticado, por favor inicia sesion o registrate.'})
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router