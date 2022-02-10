const Joi = require('joi')

const userSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password : Joi.string().min(4).required()
})

export {userSchema}