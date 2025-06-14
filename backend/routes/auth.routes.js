const express = require('express');
const router = express.Router();
const { loginPersona } = require('../controllers/auth.controller');

router.post('/auth/login', loginPersona);

module.exports = router;