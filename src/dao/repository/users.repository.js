const bcrypt = require('bcrypt')
const Users = require('../../models/users.models')
const Cart = require('../../models/carts.models')
const { admin_email, admin_password } = require('../../config/superAdmin')

class UserRepository{
    async createUser(userInfo){
       try {
		const {first_name,last_name,email,age,password} = userInfo

    // Verificar si el usuario es admin y lo clasifica
    let role = 'usuario'
    // Comparar la contraseña ingresada con el hash almacenado en la variable admin_password
    const passwordMatch = bcrypt.compare(password, admin_password)

    if (email === admin_email && passwordMatch) {
      role = 'administrador';
    }

    //crear un carrito para el usuario
    const cart = new Cart()
    await cart.save()
    const cartId = cart._id
    
		//Agregar la clave role a la informacion del usuario
    const newUserInfo = {
      first_name,
      last_name,
      email,
      age,
      password,
      role,
      cartId,
    }
    //Crear un nuevo usuario con su respectiva info y rol
    const user = await Users.create(newUserInfo)
		return user
        
       } catch (error) {
        throw error
       }

    }
}
module.exports = UserRepository