const mongoose = require('mongoose');
mongoose.pluralize(null);
const CategorySchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String
})

module.exports = mongoose.model("categories", CategorySchema)