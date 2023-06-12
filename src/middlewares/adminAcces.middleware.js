function adminAccess(req,res,next){
    if(req.user.role === 'administrador'){
        next()
    }else{ 
    res.status(401).json({error: 'No tienes acceso como Administrador'}) }
}

module.exports = adminAccess