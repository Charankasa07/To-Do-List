const joi = require('joi')

const user_validation = async (data) =>{
    const schema = joi.object({
        name : joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().required().min(8)
    })

    return schema.validate(data)
}

const login = async (data)=>{
    const login = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required().min(8)
    })

    return login.validate(data)  
}

module.exports.user_validation = user_validation
module.exports.login = login