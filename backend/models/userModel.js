const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'teacher', 'student'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userModel.pre('save', async function(next) {
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userModel.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userModel)
module.exports = User