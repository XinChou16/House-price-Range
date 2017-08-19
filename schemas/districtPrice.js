/**
 * districtPrice小区价格表
 */
  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var districtPriceSchema = new Schema({
    district: {type: ObjectId, ref: 'District'}, // 区域
    time: String, // 时间
    newHouseprice: Number, // 新房价格
    secondHandHouseprice: Number, // 二手房价格
})


module.exports = districtPriceSchema;
