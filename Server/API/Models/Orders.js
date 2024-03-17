const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.pluralize(null);
const DataSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    carTitel:String,
    carDetails:Object,
    parts:Array,
    suplliers:Array,
    Uid:ObjectId,
    Odate:String,
    brandImg:String,
    status:Array
})

module.exports = mongoose.model("orders", DataSchema)