const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar:{ 
        type: String,
        default: ""
    },
    scorePoints: {
        type:  String, 
        default: 0
    }, 
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User