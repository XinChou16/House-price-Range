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
  res.json('首页');
}) 



// 爬虫路由
router.get('/crawl', function (req, res, next) {
    
  
  
  res.json('success');
}) 
gzCrawl();

// fangdd 爬虫
async function gzCrawl(){
  const zonePages = [20,20,20,20,20,20,10,15,6,4,4];
  const fddDistUrl = 'http://esf.fangdd.com/guangzhou/xiaoqu' ;
  const fddDistHtml = await request(fddDistUrl);
  const distLinkArr = getFddDistr(fddDistHtml);// 包含行政区{name,id，url}\
  
  // 爬取11个行政区价格，只爬一次 即可
//    const options = {
//     url: 'http://esf.fangdd.com/map/ajax/searchGarden/section?city_id=852',
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
//     }
//   };
//   const distRsp2 =  await request(options);
//   const distData = JSON.parse(distRsp2);
//   for (let m = 0; m < 11; m++) {
//     const distPriceUrl = 'http://guangzhou.fangdd.com/tt/api/chart/housePrice/line/'+distLinkArr[m].id;
//     const distPriceRsp = await request({url:distPriceUrl}).catch(err => console.log(err))
//     const distPriceObj = JSON.parse(distPriceRsp);
//     const distPriceSave = await fetchDistPrice(distPriceObj,distLinkArr[m].name,distLinkArr[m].id,distData.data[m]);
//     await sleep(500);
//     console.log('第'+ (m+1) +'个区完成')
//   }
  console.log(new Date() + '房多多爬虫开始...')
// 1.循环11个行政区，获得小区
for (let l = 8; l < 9; l++) {  //l,行政区个数,11
    const distUrl = distLinkArr[l].url;
    const zoneNumRsp = await request(distUrl);
    await sleep(200);

    //2. 循环所有小区，获取小区id，链接
    for (let i = 1; i < zonePages[l]+1; i++) { // i,页面数,zonePages[l]+1,起始值为1
      const zonePageUrl = distUrl + '_pa' + i;//http://esf.fangdd.com/shenzhen/xiaoqu_s988_pa2/
      const zonePageRsp = await request(zonePageUrl);
      const zonePageInfo = fetchZonePageInfo(zonePageRsp);//{name: ,url:}

      // 3.循环所有小区，得到小区信息
      for (let j = 0; j < 15; j++) { // zoneNum[i-1] 页面小区数最后一页可能不为15个
        const zoneUrl = zonePageInfo[j].url;
        const zoneRsp = await request(zoneUrl);
        await sleep(100);
        const zoneInfo = fetchZoneInfo(zoneRsp);// 小区信息
        
        const priceUrl = 'http://esf.fangdd.com/data/cell/price_history_trend?type=4&id='+zoneInfo.zoneId;//491
        const priceRsp = await request({url:priceUrl,});//timeout:100
        await sleep(100);
        const priceInfo = fetchPriceInfo(priceRsp);//价格信息 {dealPric,dealCount,listPric}
        
        const dealPriceAvgList = [];// 小区成交均价
        const dealTimeList = [];
        for (let i = 0; i < 6; i++) {
          const time = '2017年' + priceInfo.listPric[i].time_str;
          const num = priceInfo.listPric[i].number;
          dealPriceAvgList.push(num);
          dealTimeList.push(time);
        }// 成交价半年上涨率
        const priceRiseAvgHalfY = parseFloat(((dealPriceAvgList[5] - dealPriceAvgList[0])/dealPriceAvgList[0]).toFixed(3));
     
        // 保存小区表
        const districtFind = await District.findOne({'district': zoneInfo.zoneBeloDist});
        
        const zone = new Zone({
          district: districtFind._id,// 行政区域，如浦东
          name: zoneInfo.zoneName, // 小区名字
          zoneID: zoneInfo.zoneId, // 小区id  
          x: zoneInfo.zoneGeoX, // 百度地图经度
          y: zoneInfo.zoneGeoY, // 百度地图纬度
          priceRateHalfY: (priceRiseAvgHalfY*100).toFixed(1) + '%', // 二手房半年上涨率
        })
        const zoneSaved = await zone.save();
        // 保存小区价格表
        for (let j = 0; j < 6; j++) {
          const zonePrice = new ZonePrice({
            zone: zoneSaved._id,
            time: dealTimeList[j], // 时间
            price: dealPriceAvgList[j], // 价格,成交均价
          })
          zonePrice.save();
        }

      }
      console.log('正爬取 '+distLinkArr[l].name+' 区..., '+'爬取第'+i+'页数据完成')
    }
    console.log(new Date() + '房多多爬虫结束...')
  }
}


// 获取行政区区id
function getFddDistr(body){
  if (body === 'undefined') return;
  const $ = cheerio.load(body);
  const distLinkBodyArr = $('.item-parent a').toArray();
  const distLinkArr = [];
  
  for (let i = 1; i < 12; i++) {
    const ele = distLinkBodyArr[i].attribs;
    distLinkArr.push({
      name: distLinkBodyArr[i].children[0].data,// 小区名
      url: ele.href.slice(0,-1),// 小区url
      id: ele.href.slice(ele.href.indexOf('_')+2,-1) //行政区id
    });
  }
  return distLinkArr;
}

// 获取小区个数
function fetchZoneNum(body){
  if (body === 'undefined') return;
  const $ = cheerio.load(body);
  const zoneNumStr = $('.pull-left span').toArray();
  const zoneNum = Number(zoneNumStr[0].children[0].data);
  const zoneNumPer = [];
  if (zoneNum > 300) {
    for (var z = 0; z < 20; z++) {
      zoneNumPer.push(15);
    }
    return zoneNumPer;
  }else{
    for (var y = 0; y < Math.floor(zoneNum/15); y++) {
      zoneNumPer.push(15);
    }
    zoneNumPer.push(zoneNum%15);
    return zoneNumPer
  }
}


// 获取小区链接
function fetchZonePageInfo(body){
  const $ = cheerio.load(body);
  const zoneUrlArr = $('.text--info a').toArray();
  const zoneUrl = [];
  for (let i = 0; i < 15; i++) {
    const ele = zoneUrlArr[i];
    zoneUrl.push({
      name: ele.children[0].data,
      url: ele.attribs.href
    });
  }
  return zoneUrl;
}

// 获取小区信息
function fetchZoneInfo(body) {
  const $ = cheerio.load(body);
  const zoneInfoObj = $('script').toArray();
  const zoneStr = zoneInfoObj[11].children[0].data; 
  const zoneStrArr = zoneStr.split(';')
  const zoneInfo = [];
  const zoneId = zoneStrArr[2].slice(zoneStrArr[2].indexOf('=')+3,-1);
  const zoneName = zoneStrArr[3].slice(zoneStrArr[3].indexOf('=')+3,-1);
  const zoneBeloDist = zoneStrArr[4].slice(zoneStrArr[4].indexOf('=')+3,-1);
  const zoneGeo = zoneStrArr[5].slice(zoneStrArr[5].indexOf('=')+3,-1);
  const zonePrice = zoneStrArr[6].slice(zoneStrArr[6].indexOf('=')+3,-1);

  return {
    zoneId: zoneId,
    zoneName: zoneName,
    zoneBeloDist: zoneBeloDist,
    zoneGeoX: Number(zoneGeo.substr(0,20)),
    zoneGeoY: Number(zoneGeo.substr(21,20)),
    zonePrice: Number(zonePrice),
  }
}

// 获取小区房价，JSON数据中的第三个fields
function fetchZonePrice(body){
  if(body === 'undefined') return;
  const zonePriceArr = [];
  const priceObj = JSON.parse(body);
  
  for (let l = 0; l < 12; l++) {
    if (l < 4) {
      var year = '2016年'
    }else{
      var year = '2017年'
    }
    const ele = priceObj.data.list[(l*3)+2].value
    zonePriceArr.push({
      time: year + priceObj.data.list[(l*3)+2].axisX,
      price: ele
    })
  }
  return zonePriceArr;
}

// 获取小区价格及成交量
function fetchPriceInfo(data){
  const jsonData = JSON.parse(data);
  if(jsonData.code !== '00000') return;
  const dealPric = jsonData.data[0].detail;//jsonData.data[0].detail[0].number
  const dealCount = jsonData.data[1].detail;
  const listPric = jsonData.data[2].detail;
  return {
    dealPric: dealPric,//[0].number
    dealCount: dealCount,
    listPric: listPric
  }
}

// 存储行政区价格
async function fetchDistPrice(distPriceObj,distName,distId,distJson){
  // 获取小区房价，JSON数据中的第二，三个fields
  if(!distPriceObj.data.list) return;
  // 计算上涨率
  const shandHouseAvgList = [];
  for (let i = 0; i < 12; i++) {
    const ele = distPriceObj.data.list[(i*2)+1].value;
    shandHouseAvgList.push(ele);
  }
  const priceRiseAvgMon = parseFloat(((shandHouseAvgList[11] - shandHouseAvgList[0])/shandHouseAvgList[0]).toFixed(3));

  const district = new District({
    city: '广州', //城市
    district: distJson.name, // 区域
    districtId: distJson.id, // 区域id
    priceRateHalfM: (priceRiseAvgMon*100).toFixed(1) + '%', // 二手房每月上涨率
    price: distJson.price,
    houseCount: distJson.houseCount,
    y: distJson.maplat, 
    x: distJson.maplng,
  })

  const distSaved = await district.save();
  // 保存区域价格表
  for (let m = 0; m < 12; m++) {
    const newHouseprice = distPriceObj.data.list[(m*2)].value;
    const secondHandHouseprice = distPriceObj.data.list[(m*2)+1].value;
    if (m < 4) {
      var year = '2016年'
    }else{
      var year = '2017年'
    }
    const districtPrice = new DistrictPrice({
      district: distSaved._id, // 区域
      time: year + distPriceObj.data.list[m*2].axisX, // 时间
      newHouseprice: newHouseprice, // 新房价格
      secondHandHouseprice: secondHandHouseprice, // 二手房价格
    })
    const distPriceSaved = await districtPrice.save();
  }
}


// 获取行政区经纬度
async function getMAp () {
  const options = {
    url: 'http://esf.fangdd.com/map/ajax/searchGarden/section?city_id=1337',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
    }
  };
  const distRsp2 =  await request(options);
  const data = JSON.parse(distRsp2);
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
    setTimeout(function(){
      resolve();
    },delayTime)
  })
}

module.exports = router;