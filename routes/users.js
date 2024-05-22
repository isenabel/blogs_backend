var express = require('express');
var router = express.Router();
const schemas = require('../models/schemas')
const bcrypt = require("bcrypt")

const saltRounds = 10;

// ============= Fuctions ============= //

async function hashPassword(password) {
  await bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      return hash;
    })
    .catch(err => console.error(err.message))
}

async function comparePassword(password, hashPassword) {
  await bcrypt
    .compare(password, hashPassword)
    .then(res => {
      return res;
    })
    .catch(err => console.error(err.message))
}

// ========================================= //

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username', async (req, res) => {

  const userData = await schemas.Users.findOne({ username: req.params.username }).exec();

  res.json(userData)

  res.end()
})

router.post('/login', async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const userData = {
    username: false,
    password: false
  };

  const rawUserData = await schemas.Users.findOne({ username: username }).exec();

  if (rawUserData) {
    if (username === rawUserData.username) userData.username = true;

    userData.password = comparePassword(password, rawUserData.password);
  }

  res.json(userData)

  res.end()
})

router.post('/', async (req, res) => {
  const { username, fullName, password, recoveryAnswer, recoveryQuestion, role } = req.body;

  const newPassword = await hashPassword(password);

  const newUser = new schemas.Users({
    username: username, fullName: fullName, password: newPassword,
    recoveryAnswer: recoveryAnswer, recoveryQuestion: recoveryQuestion,
    role: role
  })
  const saveUser = await newUser.save()

  if (saveUser) {
    res.json({ message: 'User created' })
  } else {
    res.json({ message: 'Failed. User not created' })
  }

  res.end()
})

router.put('/:username', async (req, res) => {

  const { password, fullName } = req.body;
  const filter = { username: req.params.username };

  if (password) {
    const hashedPassword = await hashPassword(password)

    const update = { password: hashedPassword };

    const updateUser = await schemas.Users.findOneAndUpdate(filter, update);

    if (updateUser) {
      res.json({ message: 'User updated' })
    } else {
      res.json({ message: 'Failed. User not updated' })
    }
  }

  if (fullName) {
    const update = { fullName: fullName };

    const updateUser = await schemas.Users.findOneAndUpdate(filter, update);

    if (updateUser) {
      res.json({ message: 'User updated' })
    } else {
      res.json({ message: 'Failed. User not updated' })
    }
  }

  res.end()
})

router.delete('/:username', async (req, res) => {
  const filter = { username: req.params.username };

  const deleteUser = await schemas.Users.findOneAndDelete(filter);

  if (deleteUser) {
    res.json({ message: 'User deleted' })
  } else {
    res.json({ message: 'Failed. User not deleted' })
  }

  res.end()
})

module.exports = router;
