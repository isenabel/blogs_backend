const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const bcrypt = require("bcrypt")

const saltRounds = 10;

router.get('/blogs', async (req, res) => {
  const blogsData = await schemas.Blogs.find({}).exec()

  if (blogsData) {
    res.json(blogsData)
  } else {
    res.json({ message: 'Failed. Blogs not found' })
  }

  res.end()
})

router.get('/blogs/:id', async (req, res) => {
  const blogsData = await schemas.Blogs.findById(req.params.id).exec()

  if (blogsData) {
    res.json(blogsData)
  } else {
    res.json({ message: 'Failed. Blog not found' })
  }
  res.end();
})

router.get('/blogs/all/:limit', async (req, res) => {
  const blogsData = await schemas.Blogs.find({}).sort({ date: -1 }).limit(req.params.limit).exec()

  if (blogsData) {
    res.json(blogsData)
  } else {
    res.json({ message: 'Blog not filtered' })
  }

  res.end()
})

router.post('/blogs', async (req, res) => {
  const { title, body, author, date } = req.body

  const newBlog = new schemas.Blogs({ title: title, body: body, author: author, date: date })
  const saveBlog = await newBlog.save()

  if (saveBlog) {
    res.json({ message: 'Blog added' })
  } else {
    res.json({ message: 'Failed. Blog not added' })
  }

  res.end()
})

router.delete('/blogs/:id', async (req, res) => {
  const deleteBlog = await schemas.Blogs.findByIdAndDelete(req.params.id);

  if (deleteBlog) {
    res.json({ message: 'Blog deleted' })
  } else {
    res.json({ message: 'Failed. Blog not deleted' })
  }

  res.end()
})

// ----------- Users----------------

router.get('/users/:username', async (req, res) => {

  const userData = await schemas.Users.findOne({ username: req.params.username }).exec();

  res.json(userData)

  res.end()
})

router.post('/users/login', async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const userData = {
    username: false,
    password: false
  };

  const rawUserData = await schemas.Users.findOne({ username: username }).exec();

  if (rawUserData) {
    if (username === rawUserData.username) userData.username = true;

    userData.password = await comparePassword(password, rawUserData.password);
  }

  res.json(userData)

  res.end()
})

router.post('/users', async (req, res) => {
  const { username, fullName, password, recoveryAnswer, recoveryQuestion, role } = req.body;

  let hashPassword = '';

  await bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      hashPassword = hash;
    })
    .catch(err => console.error(err.message))

  const newUser = new schemas.Users({
    username: username, fullName: fullName, password: hashPassword,
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

router.put('/users/:username', async (req, res) => {

  const { password, fullName } = req.body;
  const filter = { username: req.params.username };

  if (password) {
    const update = { password: password };

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

router.delete('/users/:username', async (req, res) => {
  const filter = { username: req.params.username };

  const deleteUser = await schemas.Users.findOneAndDelete(filter);

  if (deleteUser) {
    res.json({ message: 'User deleted' })
  } else {
    res.json({ message: 'Failed. User not deleted' })
  }

  res.end()
})

// ============= Fuctions ============= //

function comparePassword(password, hashPassword) {
  bcrypt
    .compare(password, hashPassword)
    .then(res => {
      return res;
    })
    .catch(err => console.error(err.message))
}

module.exports = router