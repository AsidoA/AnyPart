const mongoose = require('mongoose');
mongoose.pluralize(null);
const DataSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    condition:String,
    isClicked:Boolean,
    category:mongoose.Schema.Types.ObjectId,
    price:Number,
    notInStock:Boolean,
})

module.exports = mongoose.model("parts", DataSchema)