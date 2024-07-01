import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils.js';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.error('Error al verificar el token:', err);
        return res.sendStatus(403); // Forbidden si el token no es válido
      }
      
      // Verifica si existe user.user, de lo contrario, usa decodedToken directamente
      req.user = decodedToken.user || decodedToken;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized si no hay token en el encabezado de autorización
  }
};

