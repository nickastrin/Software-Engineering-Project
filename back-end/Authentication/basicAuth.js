require('dotenv').config()
const jwt = require('jsonwebtoken')

function authRole(is_admin) {
  return (req, res, next) => {
    if (req.user.is_admin !== is_admin) {
      res.status(401)
      return res.send('Unauthorized for that section')
    }

    next()
  }
}

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null) return res.status(401).send('token required');

  //here we know we have a token
  jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET, (err, user) => {
    if(err) return res.status(403).send('this token is not valid');

    //here we know we have a valid token
    req.user = user;
    //move on from middleware
    next();
  })
}
  
module.exports = {
  authRole,
  authenticateToken
}