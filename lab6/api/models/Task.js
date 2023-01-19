const {
    Schema,
    model
} = require('mongoose')

const schema = new Schema({
    description: {
        type: String,
        require
    },
    complete: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        require
    },
})

module.exports = model('Tasks', schema)