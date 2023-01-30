const mongoose = require('mongoose')

const schema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    task:{
        type:String,
        required:true
    },
    priority:{
        type:Number,
        required:true,
        min:1,
        max:9
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    }
},{strict:false})

module.exports = mongoose.model('task',schema)