const { Router } = require('express')
const router = Router()
const recognition = require('./recognition')

router.use(recognition)

router.use(setJSON)

function setJSON(req, res, next) {
  res.contentType('application/json')
  next()
}

module.exports = router
