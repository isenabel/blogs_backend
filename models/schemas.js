const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Number }
})

const userSchema = new Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  recoveryAnswer: String,
  recoveryQuestion: String,
  role: String
})

const Blogs = mongoose.model('Blogs', blogSchema, 'blogs')
const Users = mongoose.model('Users', userSchema, 'users')
const mySchemas = { 'Blogs': Blogs, 'Users': Users }

module.exports = mySchemas