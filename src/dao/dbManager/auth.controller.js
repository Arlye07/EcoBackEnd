const { Router } = require("express");
const Users = require("../../models/users.models");
const publicAccess = require("../../middlewares/publicAccess");
const { isValidPassword } = require("../../utils/cryptPassport.utils");
const ResetPasswordRepository = require("../repository/password.repository");
const passport = require("passport");
const router = Router();

router.get("/", (req, res) => {
  try {
    res.render("login.handlebars");
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get("/faillogin", (req, res) => {
  console.log("falló estrategia de autenticacion");
  res.json({ error: "Dato no coincide , verifica email y/o contraseña." });
});

//Recuperar contraseña
router.get("/forgot-Password-email", (req, res, next) => {
  try {
    res.render("forgotPassEmail.handlebars");
  } catch (error) {
    next(error);
  }
});
router.get("/forgot-password/:email", (req, res, next) => {
  try {
    const email = req.params.email;

    res.render("resetPass.handlebars", { email });
  } catch (error) {
    next(error);
  }
});

//Enviar token
router.post("/forgot-password-email", async (req, res, next) => {
  try {
    const email = req.body.email;

    // Verifica si el correo electrónico existe en la base de datos y genera el token de restablecimiento

    const session = await Users.findOne({ email: email });

    if (!session) {
      throw new ErrorRepository(
        "Usuario no encontrado, verifica tu correo electronico",
        404
      );
    }

    const resetPasswordRepository = new ResetPasswordRepository();

    const createToken = await resetPasswordRepository.createToken(email, res);

    res.json({ message: "token sent successfully", toke: createToken });
  } catch (error) {
    next(error);
  }
});

//Restablecer contraseña
router.post("/reset-password/:email", async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const token = req.cookies.resetToken;
  console.log(token);
  console.log(req.cookies.cookie);
  const email = req.params.email;

  try {
    const resetPasswordRepository = new ResetPasswordRepository();
    await resetPasswordRepository.resetPassword(newPassword, token, email);

    res.status(200).json({ message: "Contraseña cambiada con exito" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "login/faillogin" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          error: "Usuario y contraseña no coinciden",
        });
      }
      // Establecer una session con los datos del usuario autenticado
      req.session.user = req.Users
      const date = new Date()
      await Users.findByIdAndUpdate(req.session.user._id,{last_connection:date})
      req.session.save()
      res.status(200).json({ status: "succes", message: "sesion establecida" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    const date = new Date()
      await Users.findByIdAndUpdate(req.user._id,{last_connection:date})
    req.session.user = req.user;
    res.redirect("/api/dbProducts");
  }
);
// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }),
//   async (req, res) => {}
// )

// router.get(
//   '/googlecallback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   async (req, res) => {
//     req.session.user = req.user
//     res.redirect('/')
//   }
// )

router.get("/logout", async (req, res) => {
  const date = new Date()
      await Users.findByIdAndUpdate(req.user._id,{last_connection:date})
  req.session.destroy((error) => {
    if (error) return res.json({ error });
    res.redirect("/api/login");
  });
});

module.exports = router;
