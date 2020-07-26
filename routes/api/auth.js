const express = require('express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('./../../models/User');

// @route   GET api/auth
// @desc    Authenticate and return user info
// @access  Private
router.get('/', auth, async (req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    check('email', 'Por favor, insira um Email válido').isEmail(),
    check('password', 'Senha é obrigatória').exists()
], async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {email, password} = req.body;
    try {

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors: [{msg: 'Credenciais inválidas'}]});
        }

       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Credenciais inválidas'}]});
       }

        const payload = {
            user: {
                id: user.id,
            }
        };

        jwt.sign(payload, process.env['JWT_SECRET'], {
            expiresIn: 3600000 //placeholder while testing
        }, (err, token) => {

            if(err) throw err;
            res.json({token});
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;