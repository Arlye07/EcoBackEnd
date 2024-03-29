const nodemailer = require("nodemailer");
const logger =require("../../config/logger.config")
const ErrorRepository= require("../repository/errors.repository")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Users = require("../../models/users.models")
const {secret_key} =require("../../config/app.config")


class ResetPasswordRepository {
  async sendPasswordResetedEmail(email) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "arielvillagra7@gmail.com",
        pass: "ovehnnzjxkudsypn",
      },
    });

    const resetLink = `http://localhost:8080/api/login/forgot-password/${email}`;

    const mailOptions = {
      from: "arielvillagra7@gmail.com",
      to: email,
      subject: "Restablecimiento de contraseña",
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
      } else {
        console.log("Correo electrónico enviado:", info.response);
      }
    });
  }

  async createToken(email, res) {
    try {
      // Generar token con el email del usuario
      const token = jwt.sign({ email }, secret_key, { expiresIn: "1h" });

      await this.sendPasswordResetedEmail(email);
    
      // Guarda el token en una cookie
      res.cookie("resetToken", token, { maxAge: 3600000, httpOnly: true });
      res.cookie("cookie", "hola funciona")
      logger.info("Token generado con exito", token);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(newPassword, token, email) {
    try {
        console.log(newPassword, token, email);
      const decodecToken = jwt.verify(token, secret_key);
      if (decodecToken.email !== email) {
        return new ErrorRepository(
          "El usuario no coincide con el email de solicitud.",
          401
        );
      }
      const user = await Users.findOne({ email: email });
      // Compara la nueva contraseña con la contraseña almacenada en la base de datos
      const passwordMatch = bcrypt.compareSync(newPassword, user.password);

      if (passwordMatch) {
        alert("La contraseña debe ser diferente a la anterior");
        return res
          .status(401)
          .json({
            error: "La nueva contraseña debe ser diferente a la anterior",
          });
      }

      const hashedPass = await bcrypt.hash(newPassword, 10);

      // Actualiza la contraseña en la base de datos
      user.password = hashedPass;
      await user.save();

      logger.info("Contraseña actualizada con exito");
    } catch (error) {
      throw new ErrorRepository("Error al actualizar la contraseña", 500);
    }
  }
}


module.exports= ResetPasswordRepository