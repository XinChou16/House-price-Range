/**
 * zone小区表
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ZoneSchema = new Schema({
    city: String, //城市
    district: String, // 行政区域，浦东
    name: String, // 小区名字
    houseID: String, // 小区id
    x: Number, // 百度地图经度
    y: Number, // 百度地图纬度
    subwayName: String, // 附近地铁站名称
    subwayDistance: Number, // 距地铁站距离
    priceRiseAvgMon: Number, // 房价平均每月上涨
    // priceRateOneY: Number, // 一年上涨率
    // priceRateTwoY: Number, // 两年上涨率
    // priceRateThreeY: Number, // 三年上涨率
    // zonePrices: [], // 
})


module.exports = ZoneSchema;
