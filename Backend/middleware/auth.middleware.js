import jwt from "jsonwebtoken";


export const authenticateToken = (req, res, next) =>{
    const JWT_SECRET= process.env.JWT_SECRET_KEY;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.user = user;
      next();
    });
}

export default authenticateToken;