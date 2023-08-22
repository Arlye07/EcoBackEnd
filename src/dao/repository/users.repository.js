const bcrypt = require("bcrypt");
const Users = require("../../models/users.models");
const Cart = require("../../models/carts.models");
const ErrorRepository = require('./errors.repository')
const {
  admin_email,
  admin_password,
} = require("../../config/superAdmin.config");

class UserRepository {
  async createUser(userInfo) {
    try {
      const { first_name, last_name, email, age, password } = userInfo;

      // Verificar si el usuario es admin y lo clasifica
      let role = "usuario";
      // Comparar la contraseña ingresada con el hash almacenado en la variable admin_password
      const passwordMatch = bcrypt.compare(password, admin_password);

      if (email === admin_email && passwordMatch) {
        role = "administrador";
      }

      //crear un carrito para el usuario
      const cart = new Cart();
      await cart.save();
      const cartId = cart._id;

      //Agregar la clave role a la informacion del usuario
      const newUserInfo = {
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cartId,
      };
      //Crear un nuevo usuario con su respectiva info y rol
      const user = await Users.create(newUserInfo);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async changeUserRole(user) {
    try {
      const usuario = await Users.findOne({ _id: user._id });

      if (usuario.role === "usuario") {
        usuario.role = "premium";
      } else {
        usuario.role = "usuario";
      }

      await usuario.updateOne({ role: usuario.role });

      return usuario;
    } catch (error) {
      logger.error("Error al cambiar el role del usuario", error);
      throw new ErrorRepository("Error al cambiar el rol", 500);
    }
  }
  async deleteInactiveUsers() {
    try {
      const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
      const currentTime = new Date();

      const users = await Users.find({
        last_conection: { $lt: new Date(currentTime - twoDaysInMilliseconds) },
      });

      for (const user of users) {
        try {
          const lastConnectionTime = user.last_conection;
          const timeDifference = currentTime - lastConnectionTime;

          if (timeDifference >= twoDaysInMilliseconds) {
            // Enviar el correo electrónico
            await this.sendInactiveUserEmail(user.email);

            // Eliminar la cuenta
            await Users.findByIdAndDelete(user._id);

            logger.info(
              `Cuenta del usuario ${user.email} eliminada por inactividad.`
            );
          }
        } catch (emailError) {
          logger.error(
            `Error al enviar el correo al usuario ${user.email}:`,
            emailError
          );
        }
      }
    } catch (error) {
      logger.error("Error al eliminar usuarios inactivos:", error);
      throw new ErrorRepository("Error al eliminar usuarios inactivos", 500);
    }
  }
}

module.exports = UserRepository;
