/**
 * zonePrice小区价格表
 */
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ZonePriceSchema = new Schema({
    zone: {type: ObjectId, ref: 'Zone'},
    time: String, // 时间
    price: Number, // 价格
    priceRiseMon: Number, // 房价每月上涨
    district: String, // 区域
})


module.exports = ZonePriceSchema;
