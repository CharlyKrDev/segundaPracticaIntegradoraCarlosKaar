import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils.js';


export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, credentials) => {
      if (err) {
        console.error('Error al verificar el token:', err);
        return res.sendStatus(403); // Forbidden si el token no es válido
      }
      
      // Verifica si existe user.user, de lo contrario, usa decodedToken directamente
      req.user = credentials.user || credentials;
      next();
    });
  } else {
    console.log('No token found in Authorization header');
    res.sendStatus(401); // Unauthorized si no hay token en el encabezado de autorización
  }
};
