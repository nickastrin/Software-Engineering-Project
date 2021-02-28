require('dotenv').config()
const jwt = require('jsonwebtoken')
const {checkToken, addToken, deleteToken, clearTokens} = require('./tokens')

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
  const authHeader = req.headers['x-observatory-auth'] || req.headers['authorization'];
  let token = authHeader;
  if(!authHeader) return res.status(401).send('token required');

  if (authHeader.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = authHeader.split(' ')[1];
  }

  //here we know we have a token
  jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET, (err, user) => {
    if(err) return res.status(401).send('this token is not valid');

    //here we know we have a valid token
    if(!checkToken(token)) return res.status(401).send('this token has expired');

    //here we know we have a valid token that has not expired
    req.user = user;
    req.token = token;
    //move on from middleware
    next();
  })
}
  
module.exports = {
  authRole,
  authenticateToken
}