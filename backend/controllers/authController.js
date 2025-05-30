const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

        res.status(201).json({
            status: 'success',
            token,
            data:{
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const {name, email, password} = req.body

        if (!name && !email || !password) {
            return res.status(400).json({
                status: 'failed',
                message: 'no name or password'
            })
        }

        const user = await User.findOne(name?{name} : {email}).select('+password')
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'failed',
                message: 'incorrect information'
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.status(200).json({
            status: 'success',
            data: {
                id: user._id,
                name: user.name,
                role: user.role
            },
            token
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message
        })
    }
}

exports.protect = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({
            status: 'failed',
            message: 'no token found'
        })
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.userId = await User.findById(decoded.id)
    next()
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'failed',
                message: 'you do not have permission to perform this action'
            })
        }
        next()
    }
}