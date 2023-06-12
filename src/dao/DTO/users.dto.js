class UserDTO{
   constructor (userSession){
    this.firt_name = userSession.firt_name
    this.last_name = userSession.last_name
    this.email = userSession.email
    this.role = userSession.role
   }
 }

 module.exports = UserDTO