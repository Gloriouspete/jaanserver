require('dotenv').config()
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET
const excludedRoutes = ['/api/v1/login','/api/v1/getdata','/api/v1/resetpass', '/api/v1/signup', '/api/v1/forgot','/api/v1/verifyacc', '/', '/webhooksuccess','/email','/admin/login/','/admin/createuser','/paywebhook'];

  function authenticateJWT(req, res, next) {
    if (excludedRoutes.includes(req.url)) {
        return next();
    }

    const token = req.headers['authorization'];
    if (!token) {
        console.log('missing token')
        return res.status(401).json({ message: 'Bearer token is missing' });
    }

    try {
        console.log(token,"dde")
        const decodedToken = jwt.verify(token, secretKey);
        req.user = decodedToken;
        console.log('this is', req.user)
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Invalid token' });
    }
}
module.exports = authenticateJWT