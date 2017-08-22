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
    x: Number,
    y: Number,
    priceRateHalfM: Number, // 二手房每月上涨率
})


module.exports = districtSchema;
