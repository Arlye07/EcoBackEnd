const { Router } = require("express");
const Users = require("../../models/users.models");
const { hashPassword } = require("../../utils/cryptPassport.utils");
const ErrorRepository = require("../repository/errors.repository");
//const UserRepository = require('../repository/users.repository')
const passport = require("passport");
const router = Router();

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "register/failresgister",
  }),
  async (req, res, next) => {
    try {
      const newUser = req.user;
      res.status(201).json({ status: "success", message: newUser });
    } catch (error) {
      console.log(error.message);
      next(new ErrorRepository("error", 500));
    }
  }
);

router.get("/", (req, res, next) => {
  try {
    res.render("signup.handlebars");
  } catch (error) {
    next(new ErrorRepository("error", 500));
  }
});

router.get("/failregister", (req, res, next) => {
  console.log("falló estrategia de registro!");
  next(new ErrorRepository("error", 500));
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

module.exports = router;
