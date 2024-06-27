export const renderLogin = (req, res) => {
    res.render("login", { style: "style.css" });
  };
  
  export const renderRegister = (req, res) => {
    res.render("register", { style: "style.css" });
  };
  
  export const renderCurrent = (req, res) => {
    res.render("current", { user: req.session.user, style: "style.css" });
  };
  

