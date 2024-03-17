const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.pluralize(null);
const DataSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    gname:String,
    gemail:String,
    gdesc:String,
    gaddress:String,
    gcity:String,
    ghours:Array,
    greview:Array,
    gimg:String,
    gphone:String
})

module.exports = mongoose.model("garages", DataSchema)