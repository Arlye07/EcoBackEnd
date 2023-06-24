const ErrorRepository = require("../dao/repository/errors.repository")
function adminAccess(req,res,next){
    if(req.user.role === 'administrador'){
        next()
    }else{ 
        next(new ErrorRepository(401)) }
}

module.exports = adminAccess