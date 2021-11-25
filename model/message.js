const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "an't be blank"],
    },

    subject: {

        type: String,
        required: [true, "an't be blank"],
    },
    message: {
        type: String,
        required: [true, "an't be blank"]
    },

    from: {
        type: String,
        required: [true, "an't be blank"]
    },
    to: {
        type: String,
        required: [true, "an't be blank"]
    },



}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);