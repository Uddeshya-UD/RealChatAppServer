const { Router } = require('express')
const authController = require('../authController/authController')
const router = Router()

router.post('/api/login',authController.login_post)
router.post('/api/register',authController.signin_post)

module.exports = router;