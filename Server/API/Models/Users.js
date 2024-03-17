const mongoose = require('mongoose');
mongoose.pluralize(null);
const UserSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_name:String,
    phone:String,
    email:String,
    password:String,
    address:String,
    city:String,
    type:String
})

module.exports = mongoose.model("users", UserSchema)