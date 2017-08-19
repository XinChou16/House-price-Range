var mongoose = require("mongoose");
var districtPriceSchema = require("../schemas/districtPrice");
var districtPrice = mongoose.model('districtPrice',districtPriceSchema);

module.exports = districtPrice; 