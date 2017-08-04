var mongoose = require("mongoose");
var ZonePriceSchema = require("../schemas/ZonePrice");
var ZonePrice = mongoose.model('ZonePrice',ZonePriceSchema);

module.exports = ZonePrice; 