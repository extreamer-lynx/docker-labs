const {
    Schema,
    model
} = require('mongoose')

const schema = new Schema({
    email: String,
    password: String,
    session: [],
    name: String,
    age: Number,
})

module.exports = model('Users', schema)