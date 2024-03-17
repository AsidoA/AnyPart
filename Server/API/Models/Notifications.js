const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.pluralize(null);
const DataSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    uid:ObjectId,
    fullNameShortCut:String,
    oid:ObjectId,
    titel:String,
    content:String,
    timestamp:Date,
    status:Array,
    type:String

})

module.exports = mongoose.model("notifications", DataSchema)