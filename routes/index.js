var express = require('express');
var mongoose = require('mongoose');
var request = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Zone = require('../model/zone.js');// 小区表
var ZonePrice = require('../model/zonePrice.js');// 小区价格表


router.get('/', function (req, res, next) {
  res.render('index');
});

// 爬虫路由
router.get('/crawl', async function (req, res, next) {
  crawlData();
  res.json('success');
}) 

// 爬虫获取zone, zonePrice
async function  crawlData() {
  const baseUrl = 'http://sh.lianjia.com/xiaoqu/';
  const district = ["pudongxinqu","minhang","baoshan","xuhui","putuo","yangpu","changning","songjiang","jiading","huangpu","jingan","zhabei","hongkou","qingpu","fengxian","jinshan","chongming","shanghaizhoubian",];
  const zonePages = [100,86,59,100,58,83,87,67,64,100,68,61,84,41,43,41,28,16];
  
  console.log(new Date() + ' data process start...')
  // 循环所有行政区
  for (let i = 5; i < 6; i++) {
    // http://sh.lianjia.com/xiaoqu/pudongxinqu/
    let distUrl = baseUrl + district[i] ;
    
    // 循环所有页面小区
    for (let j = 1; j < 2; j++) {
      //http://sh.lianjia.com/xiaoqu/pudongxinqu/d1s13
      let zoneUrl = distUrl + '/d' + j + 's13';
      const zoneRsp = await request(zoneUrl);
      await sleep(500);
      let zoneInfo = fetchZoneInfo(zoneRsp);
      // console.log(zoneInfo)

      // 循环所有小区信息
      for (let k = 0; k < zoneInfo.length; k++) {
        let ele = zoneInfo[k];
        let idUrl = baseUrl + ele.houseID+ '.html';
        const responseID = await request(idUrl);
        // 获取ID
        await sleep(300);
        let plateId = fetchPlateId(responseID);// 行政区id
        let houseId = ele.houseID;// 小区id

        // 房价信息
        // http://sh.lianjia.com/xiaoqu/getStatics.json?propertyId=5011000012543&plateId=613000300
        let url = baseUrl + 'getStatics.json?propertyId=';
            url += houseId + '&plateId=' + plateId;
        let soldJSON = await request(url);
        let soldYearInfo = JSON.parse(soldJSON);
        // console.log(soldYearInfo.status)

        // 增长率
        let plateAvgList = soldYearInfo.plateAvgList;
        let priceRiseAvgMonObj = calcPriceRiseAvgMon(plateAvgList);
        let priceRiseAvgMon = parseFloat(((priceRiseAvgMonObj.maxPrice - priceRiseAvgMonObj.minPrice)/12).toFixed(2));
        
        // 存储小区
        const zone = new Zone({
          city: '上海',
          district: ele.district,
          name: ele.name,
          houseID: ele.houseID,
          x: ele.x,
          y: ele.y,
          subwayName: ele.subwayName,
          subwayDistance: ele.subwayDistance,
          priceRiseAvgMon: priceRiseAvgMon, 
        })
        const zoneSaved = await zone.save();

        // 存储小区价格
        let time = soldYearInfo.monthList;
        let priceList = soldYearInfo.plateAvgList;
        // console.log(priceList)
        for (let m = 0; m < 12; m++) {
          let platePrice = Number(priceList[m]); // 价格
          let priceRiseMon = (Number(priceList[m]) - priceRiseAvgMonObj.minPrice)/1; // 房价每月上涨
          // console.log(platePrice+'pirce'+ m )
          if (m < 5) {
            var year = '2016年'
          }else{
            var year = '2017年'
          }
          const zonePrice = new ZonePrice({
            zone: zoneSaved._id,
            time: year + time[m], // 时间
            price: platePrice, // 价格
            priceRiseMon: priceRiseMon, // 房价每月上涨
            district: ele.district, // 区域
          })
          // const zonePriceSaved = zonePrice.save();
        }
      }
      console.log('正爬取 '+district[i]+' 区..., '+'爬取第'+j+'页数据完成')
    }
  }
  console.log(new Date+'data process end...')
}

// 获取小区信息
function fetchZoneInfo(body) {
  var $ = cheerio.load(body);
  var houseArr = $('.info-panel .where a').toArray();
  var houseID = $('.info-panel h2 a').toArray();
  var subwayInfo = $('.chanquan .view-label').toArray();
  var zoneArr = [];

  for (let i = 0; i < houseArr.length; i++) {
    var ele = houseArr[i].attribs;
    var xiaoquInfo = ele.xiaoqu.replace(/\[|\]/g,'').split(', '); //小区坐标
    var xiaoquInfoX = Number(xiaoquInfo[0]);// 百度地图经度
    var xiaoquInfoY = Number(xiaoquInfo[1]);// 百度地图纬度
    var houseName = xiaoquInfo[2].slice(1,-1); //小区名
    var subwayInfoArr = subwayInfo[i];
    var subwayName,subwayDistance;// 附近地铁站名称，距地铁站距离

    // 对附近没有地铁的小区进行处理
    if (subwayInfoArr.children.length == 1) {
      subwayName = '';
      subwayDistance = 0;
    }else{
      var subwayStr = subwayInfo[i].children[3].children[0].children[0].data;
      var posStation = subwayStr.indexOf('站');
      subwayName = subwayStr.slice(2,posStation + 1);
      subwayDistance = Number(subwayStr.slice(posStation + 1,-1));
    }
    // console.log(subwayName)
    // console.log(subwayDistance)

    zoneArr.push({
      city: '上海',
      district: ele.districtname,
      name: houseName,
      houseID: houseID[i].attribs.key,
      x: xiaoquInfoX,
      y: xiaoquInfoY,
      subwayName: subwayName,
      subwayDistance: subwayDistance
    })
  }
  return zoneArr;
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

// 计算平均每月上涨价格
function calcPriceRiseAvgMon(priceArr){
  let maxPrice = 0;
  let minPrice = Number(priceArr[0]);
  for (let l = 0; l < priceArr.length; l++) {
    let ele = Number(priceArr[l]);
    
    if (maxPrice < ele) {
      maxPrice = ele;
    }
    if (minPrice > Number(priceArr[l+1])) {
      minPrice = Number(priceArr[l+1]);
    }
  }
  let priceinfo = {
    maxPrice: maxPrice,
    minPrice: minPrice
  }
  return priceinfo; 
}

// 延迟函数
function sleep(delayTime){
  return new Promise(function (resolve,reject){
    setTimeout(resolve,delayTime)
  })
}


module.exports = router;