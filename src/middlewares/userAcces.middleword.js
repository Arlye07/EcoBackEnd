const ErrorRepository = require("../dao/repository/errors.repository")

function userAcces (req, res,  next) {
    if(req.user.role === 'usuario'|| req.user.role === 'administrador'){ 
    next()
}else{
    next(new ErrorRepository(401))
} }

module.exports = userAcces