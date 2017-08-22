const express = require('express');
const mongoose = require('mongoose');
const request = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Zone = require('../model/zone.js');// 小区表
const ZonePrice = require('../model/zonePrice.js');// 小区价格表
const District = require('../model/district.js');// 区域表
const DistrictPrice = require('../model/districtPrice.js');// 区域价格表

router.get('/', function (req, res, next) {
  res.render('index');
});



router.post('/getDist', function (req, res, next) {
    District.find({}).exec(function(err,distDoc){
       if (distDoc) {
        res.json(distDoc)
       }else{
        res.json(err)
       }
    })
}) 

router.post('/mapGetZone', async function (req, res, next) {
    var rsb = req.body.options;
    
    const result = await Zone.find({})
    .where('y').gte(rsb.leftDownLng).lte(rsb.rightTopLng)
    .where('x').gte(rsb.leftDownLat).lte(rsb.rightTopLat);

    res.json(result);
}) 

router.post('/getZone', function (req, res, next) {
    // console.log(req.body)
    var rsb = req.body;
    District.findOne({'district':rsb.dist}).exec(function(err,distDoc){
        Zone.find({'district': distDoc._id})
        .sort({"priceRateHalfY":-1})
        .exec(function(err,zoneDoc){
            res.json(zoneDoc)
        })
    })
    // District.find({}).exec(function(err,resDoc){
    //     // console.log(resDoc)
    //     res.json(resDoc)
    // })
}) 

router.post('/getPriceHalfY', async function (req, res, next) {
    var rsb = req.body;
    
    const zoneId = await Zone.find({"_id":rsb.id});
    const result = await ZonePrice.find({"zone":zoneId});
    res.json(result);
}) 

module.exports = router;