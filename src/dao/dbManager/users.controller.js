const { Router } = require("express");
const UserRepository = require("../repository/users.repository");
const ErrorRepository = require("../repository/errors.repository");
const Users = require('../../models/users.models');
const UserDTO = require('../../dao/DTO/users.dto');
const multerUpload =require('../../config/multer.config');
const moment = require('moment');
const mailerDao = require('../../dao/mail.dao');
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find();
    const userDTOs = users.map((user) => new UserDTO(user));

    res.status(200).json(userDTOs);
  } catch (error) {
    next(error);
  }
});

router.post("/:uid/documents", multerUpload.any(), async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await Users.findById(userId);
    const uploadedDocuments = req.files.map((file) => ({
      name: file.originalname,
      reference: file.filename,
    }));
    user.document.push(...uploadedDocuments);
    await user.save();
    res.json({ message: "Document(s) uploaded successfully." });
  } catch (error) {
    console.error("Error uploading document(s):", error);
    next(error);
  }
});

router.get("/premium", async (req, res, next) => {
  try {
    const user = req.session.user;
    if (user.role === "administrador") {
      throw new ErrorRepository("Error, role no autorizado", 401);
    }
    const userRepository = new UserRepository();
    const changeRole = await userRepository.changeUserRole(user);
    logger.info("se cambio el role del usuario actual", changeRole);
    res.json({ user: changeRole });
  } catch (error) {
    logger.error("Error en el cambio del usuario", error);
    next(error);
  }
});

router.delete('/',async (req, res, next) => {
    try {
      const inactiveThreshold = moment().subtract(30, 'minutes'); // Cambia a 2 días en producción
  
      const inactiveUsers = await Users.find({
        last_conection: { $lt: inactiveThreshold.toISOString() },
      })
  
      for (const user of inactiveUsers) {
        // Enviar correo al usuario
        const mailOptions = {
          from: 'Administrador del ecommerce',
          to: user.email,
          subject: 'Cuenta inactiva',
          text: 'El equipo de ecommerce ha decidido eliminar tu cuenta debito a la inactividad de la misma.'
        }
        
        await mailerDao.sendMail(mailOptions)
  
        // Eliminar cuenta de usuario
        await Users.deleteOne(user);
      }
  
      res.status(201).json({ message: 'Cuentas eliminadas por inactividad' });
    } catch (error) {
      next(error);
    }
  })

  router.get('/deleteUser/:uid',adminAccess, async (req, res, next) => {

    try {
      const userId = req.params.uid
      const user = await Users.findOne({_id: userId})
      await Users.deleteOne({_id: userId})
  
      res.status(201).json({message: `Usuario ${user.email} eliminado`})
    } catch (error) {
      next(error)
    }
  
  })

  router.get('/changeRole/:uid',adminAccess,  async (req, res, next) => {
    try {
      const userId = req.params.uid
      const user = await Users.findById(userId)
  
      if(user.role === 'administrador'){
        throw new ErrorRepository('Error, role no autorizado', 401)
      }
  
      const changeRole = await userDao.changeUserRole(user)
      res.status(200).json({user: changeRole})
    } catch (error) {
      next(error)
    }
  })

module.exports = router;
