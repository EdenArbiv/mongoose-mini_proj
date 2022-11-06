const {Schema, model} = require('mongoose')
 
const UserSchema = new Schema({
    name: {type: String, default: ''},
    birthdate: {type: Date},
    username: {type: String},
    password: {type: String},
    phonenumber: {type: String, default: ''},
    city: {type: String, default: ''},
    profilePicture: {type: String, default: ''},
    token: { type: String , default: ''},
})


const User = model("user", UserSchema)

module.exports = {User}