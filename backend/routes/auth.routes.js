const express = require('express');
const router = express.Router();
const { loginAdmin, loginUsuario } = require('../controllers/auth.controller');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/auth/login', loginAdmin);

router.post('/login', loginUsuario);

module.exports = router;