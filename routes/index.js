var express = require('express');
var router = express.Router();
const schemas = require('../models/schemas')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET favico. */
router.get('/favico.ico', (req, res) => {
  res.sendStatus(404);
});

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

module.exports = router;
