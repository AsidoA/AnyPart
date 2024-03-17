const mongoose = require('mongoose');
mongoose.pluralize(null);
const UserSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    expires:Date,
    session:String,
})

module.exports = mongoose.model("sessions", UserSchema)