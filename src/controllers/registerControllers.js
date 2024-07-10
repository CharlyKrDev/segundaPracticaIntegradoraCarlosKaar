export const renderLogin = (req, res) => {
    res.render("login", { style: "style.css" });
  };
  
  export const renderRegister = (req, res) => {
    res.render("register", { style: "style.css" });
  };
  
  export const renderCurrent = (req, res) => {
    const userRole =  req.session.user.role
    res.render("current", { user: req.session.user, role: userRole ==="admin" || userRole==="adminMaster"
      , style: "style.css" });
  };
  

