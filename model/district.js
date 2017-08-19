var mongoose = require("mongoose");
var districtSchema = require("../schemas/district");
var district = mongoose.model('district',districtSchema);

module.exports = district; 