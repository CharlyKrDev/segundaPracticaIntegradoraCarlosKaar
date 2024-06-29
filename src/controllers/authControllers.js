export const githubAuth = (req, res) => {
  // The passport.authenticate middleware handles the GitHub authentication process
};

export const githubCallback = async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" });

  try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    res.redirect('/current');
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
};

export const register = (req, res) => {
  res.send({ status: "success", message: "Usuario registrado" });
};

export const failRegister = (req, res) => {
  console.log("Estrategia fallida");
  res.send({ error: "Falló" });
};

export const login = async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" });

  try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    res.redirect('/current');
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
};

export const failLogin = (req, res) => {
  res.send({ error: "Login fallido" });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect('/login');
  });
};
