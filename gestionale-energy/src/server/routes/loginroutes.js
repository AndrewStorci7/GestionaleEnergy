const express = require('express');
const Login = require('../inc/login');

const router = express.Router();
const loginManager = new Login();

// Routes for authenticate the user
router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Nome utente e/o password sono obbligatori");
    }

    loginManager.setUser(username, password)
    res.send({})
});