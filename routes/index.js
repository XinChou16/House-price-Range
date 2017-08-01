var express = require('express');
var mongoose = require('mongoose');
var request = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();
var District = require('../model/district');
var schedule = require('node-schedule');

var houseList = [];
var plateIdArr = [];
/* 显示主页 */
router.get('/', function (req, res, next) {
 
  res.render('index');
});

router.get('/district', async function(req, res, next) {
  for (let i = 1; i < 2; i++) {
    console.log('get page ' + i);
    var options = {
      url: 'http://sh.lianjia.com/xiaoqu/pudongxinqu/d' + i ,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      }
    };

    const response = await request(options.url);
    analyData(response);
    console.log('analydata end....' + i)
  }
  res.json('success');
}) 

async function analyData(body) {
  var $ = cheerio.load(body);
  var houseList = fetchHouseInfo($);

  for (let i = 0; i < houseList.length; i++) {
    var ele = houseList[i];
    var url2 = 'http://sh.lianjia.com/xiaoqu/' + ele.houseID+ '.html';
    
    const responseID = await request(url2);

    var plateId = fetchPlateId(responseID);
    var houseId = ele.houseID;
    var soldYearInfo = await fetchSoldInfo(houseId,plateId);
    console.log(soldYearInfo.messgae)
  }

  // console.log(houseList)
}

// 获取小区信息
function fetchHouseInfo($){
  var houseArr = $('.info-panel .where a').toArray();
  var houseID = $('.info-panel h2 a').toArray();

  // console.log(houseArr.length)
  for (let i = 0; i < houseArr.length; i++) {
    var ele = houseArr[i].attribs;
    var xiaoquInfo = ele.xiaoqu.replace(/\[|\]/g,'').split(', '); //小区坐标
    var houseName = xiaoquInfo[2].slice(1,-1); //小区名

     houseList.push({
      districtName: ele.districtname,
      houseID: houseID[i].attribs.key,
      houseName: houseName,
      coordX: xiaoquInfo[0],
      coordY: xiaoquInfo[1],
    })
  }
  return houseList;
}

// 获取plateId
function fetchPlateId(body){
  var $ = cheerio.load(body);
  var script = $('script').toArray();
  // 截取plateId
  var plateIdStr = script[11].children[0].data.toString();
  var start = plateIdStr.indexOf('plateId') + 11;
  var end = start + 9;
  var plateId = plateIdStr.slice(start,end);

  // console.log(plateId)
  return plateId;
}

// 获取房价售出信息
async function fetchSoldInfo(hId,pId){
  var url = 'http://sh.lianjia.com/xiaoqu/getStatics.json?propertyId=';
      url += hId + '&plateId=';
      url += pId;

  var soldJSON = await request(url);
  var soldYearInfo = JSON.parse(soldJSON);

  return soldYearInfo;
  
  // var propertyAvgYear = JSON.parse(soldInfo).propertyAvgYear;
  // console.log(propertyAvgYear);
}

module.exports = router;