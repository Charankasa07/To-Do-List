const mongoose = require('mongoose')

const user = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        requireed:true
    }

},{strict: false})

module.exports = mongoose.model('user',user)