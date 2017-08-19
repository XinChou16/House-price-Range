/**
 * zone小区表
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var ZoneSchema = new Schema({
    district: {type: ObjectId, ref: 'District'},// 行政区域，如浦东
    name: String, // 小区名字
    zoneID: String, // 小区id     
    x: Number, // 百度地图经度   
    y: Number, // 百度地图纬度
    priceRateHalfY: Number, // 二手房半年上涨率
    // subwayName: String, // 附近地铁站名称
    // subwayDistance: Number, // 距地铁站距离
    // priceRiseAvgMon: Number, // 房价平均每月上涨
    // priceRateOneY: Number, // 一年上涨率
    // priceRateTwoY: Number, // 两年上涨率
    // priceRateThreeY: Number, // 三年上涨率
})


module.exports = ZoneSchema;
