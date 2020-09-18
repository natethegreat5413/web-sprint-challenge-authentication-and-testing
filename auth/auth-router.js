const bcryptjs = require('bcryptjs')
const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { isValid } = require('../auth/jokes-service')
const Users = require('../users/user-model')



router.post('/register', (req, res) => {
  // implement registration
  const creds = req.body;

  if(isValid(creds)){
    const rounds = process.env.BRCYPT_ROUNDS || 8;
    // hash the password
    const hash = bcryptjs.hashSync(creds.password, rounds);
    creds.password = hash;
    // save the user to the database
    Users.add(creds)
      .then(user => {
        res.status(201).json({ data: user })
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({ message: "Please provide username and password." })
  }

});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  if(isValid(req.body)){
    Users.findBy({ username: username })
      .then(([user]) => {
        if(user && bcryptjs.compareSync(password, user.password)){
          const token = generateToken(user);
          res.status(200).json(token)
        }else{
          res.status(401).json({ message: "Invalid credentials" })
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({ message: "Please provide username and password." })
  }
});

function generateToken({id, username}){
  const payload = {
    username,
    subject: id
  }
  const config = {
    jwtSecret: process.env.JWT_SECRET || 'is it secret, is it safe?'
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, config.jwtSecret, options)
}

module.exports = router;
