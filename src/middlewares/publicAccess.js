function publicAccess(req, res, next) {
    if (req.session.user) return res.redirect('/api/dbproducts')
  
    next()
  }
  
  module.exports = publicAccess