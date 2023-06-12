function userAcces (req, res,  next) {
    if(req.user.role === 'usuario'){ 
    next()
}else{
    res.status(401).json({error:'No tienes permiso de usuario'})
} }

module.exports = userAcces