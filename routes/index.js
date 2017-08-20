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


router.get('/getZone', function (req, res, next) {
    res.json('succ')
}) 

router.post('/getZone', function (req, res, next) {
    // console.log(req.body)
    var rsb = req.body;
    District.findOne({'district':rsb.dist}).exec(function(err,distDoc){
        Zone.find({'district': distDoc._id}).exec(function(err,zoneDoc){
            res.json(zoneDoc)
        })
    })
    // District.find({}).exec(function(err,resDoc){
    //     // console.log(resDoc)
    //     res.json(resDoc)
    // })
}) 


module.exports = router;