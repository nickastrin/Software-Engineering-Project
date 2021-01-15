const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    my_id:{
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', UserSchema);