const express = require('express');
const router = express.Router();
const { loginPaciente } = require('../controllers/auth.controller');

router.post('/auth/login', loginPaciente);

module.exports = router;