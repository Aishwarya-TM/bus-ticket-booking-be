const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {ACCESS_TOKEN} = require('../configuration/config')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String, 
            required: true, 
            unique:true
        },
        password: {
            type: String,
            required:true
        },
        
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', function(next) {
    const user = this

    if (!user.isModified('password')) return next()
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error)

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error)

            user.password = hash
            next()
        })
    })
})

userSchema.methods.generateAccessJWT = function() {
    let payload = { id:this._id}
    return jwt.sign(payload, ACCESS_TOKEN, {expiresIn: '30m'})
}

module.exports = mongoose.model("users", userSchema);