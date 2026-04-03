const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type:       String,
        unique:     true,
        required:   true, 
        trim:       true
    }, 
    password: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       false
    },
    token: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;