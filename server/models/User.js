const mongoose = require('mongoose');

const SchemaUser = mongoose.Schema({
    name: String,
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    status: {
        type: Boolean,
        default: false
    },
    trash: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now()
    },
    date_updated: Date
});

module.exports = mongoose.model('users', SchemaUser);