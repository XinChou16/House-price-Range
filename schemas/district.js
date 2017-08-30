/**
 * district小区价格表
 */
  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var districtSchema = new Schema({
    city: String, //城市
    district: String, // 区域
    districtId: String, // 区域id
    y: String,
    x: String,
    priceRateHalfM: String, // 二手房每月上涨率
    price: Number,
    houseCount: Number,
})


module.exports = districtSchema;
