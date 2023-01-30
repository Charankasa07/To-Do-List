const joi = require('joi')

const task_validation = async(data)=>{
    const task = joi.object({
        email: joi.string().required().email(),
        task: joi.string().required(),
        priority: joi.number().required().min(1).max(9),
        date: joi.date().required()
    })
    return task.validate(data)
}

module.exports.task_validation = task_validation