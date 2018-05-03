const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const ImageController = require('../controllers/ImageController')

router.get('/files', (req, res, next) => {
  fs.readdir(path.join(__dirname, '../public/images-available'), (err, files) => {
    if (err) {
      res.status(500)
      res.json({ error: err })
    } else {
      res.status(200)
      res.json({ files: files })
    }
  })
})

router.get('/kernels', (req, res, next) => {
  // Get content from file
  fs.readFile(path.join(__dirname, '../kernels/kernels.json'), (err, kernels) => {
    if (err) {
      res.status(500)
      res.json({ error: err })
    } else {
      res.status(200)
      res.json({ kernels: JSON.parse(kernels) })
    }
  })
})

router.post('/convolute', async (req, res, next) => {
  try {
    let image = await ImageController.getImage(req.body.image);
    let newImageName = ImageController.convolute(image, req.body.kernel, req.body.image)
    res.json({
      rendered: newImageName
    })
  } catch (err) {
    console.log('Error during convolution', err)
    res.status(500)
    res.json({
      err: err
    })
  }
})

router.get('', (req, res, next) => {

})

router.post('/image', (req, res, next) => {
  res.json({})
})

module.exports = router;
