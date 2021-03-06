const express = require('express');
const mongoose = require('mongoose');
const request = require('request-promise');
const router = express.Router();
const session = require('express-session');
const sha512 = require('sha512');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Zone = require('../model/zone.js');// 小区表
const ZonePrice = require('../model/zonePrice.js');// 小区价格表
const District = require('../model/district.js');// 区域表
const DistrictPrice = require('../model/districtPrice.js');// 区域价格表
const User = require('../model/user.js');// 用户表

// 主页
router.get('/', function (req, res, next) {
    res.render('index');
});

// 登录测试
router.get('/get', function (req, res, next) {
    // var hash = sha512('huahua')
    // console.log(hash.toString('hex'))
    res.json(req.session.user);
        
});

// 根据小区名模糊查询
router.post('/searchZone', function (req, res, next) {
    const name = req.body.name;
    Zone.find({'name': {'$regex': name, '$options': 'i'}})
    .where('priceRateHalfY')
    .ne(0)
    .exec(function(err,distDoc){
       if (distDoc) {
        res.json(distDoc)
       }else{
        res.json(err)
       }
    })
});

// 获取区域信息
router.post('/getDist', function (req, res, next) {
    District.find({"city": "深圳"}).exec(function(err,distDoc){
       if (distDoc) {
        res.json(distDoc)
       }else{
        res.json(err)
       }
    })
}) 

// 地图获取小区信息
router.post('/mapGetZone', async function (req, res, next) {
    const rsb = req.body.options;
    
    const result = await Zone.find()
    .where('y').gte(rsb.leftDownLng).lte(rsb.rightTopLng)
    .where('x').gte(rsb.leftDownLat).lte(rsb.rightTopLat)
    .sort({"priceRateHalfY":-1})
    .where('priceRateHalfY')
    .ne('0')
    // .where('priceRateHalfY').or([{'$ne': 'NaN%'},{'$ne': '0.0%'}])
    
    res.json(result);
}) 

// 获取小区信息
router.post('/getZone', function (req, res, next) {
    // console.log(req.body)
    const rsb = req.body;
    District.findOne({'district':rsb.dist}).exec(function(err,distDoc){
        Zone.find({'district': distDoc._id})
        .sort({"priceRateHalfY":-1})
        .where('priceRateHalfY')
        .ne('0')
        .exec(function(err,zoneDoc){
            // ZonePrice.findOne({'zone':zoneDoc._id,"time" : "2017年2月"}).exec(function(err,zonePri){
            //     res.json({
            //         zoneDoc: zoneDoc,
            //         priFb: zonePri.price
            //     })
            // })
            res.json(zoneDoc)
        })
    })
}) 

// 获取房价信息
router.post('/getPriceHalfY', async function (req, res, next) {
    const rsb = req.body;
    
    const zoneId = await Zone.find({"_id":rsb.id});
    const result = await ZonePrice.find({"zone":zoneId});
    res.json(result);
}) 


/*
 *登录，注册 
 */

// 注册
router.post('/userSignup',function(req,res,next){
    const _user = req.body.user;
    const _pwd = req.body.pwd;
    
    User.find({name: _user},function(err,usrDoc){
        if(err) {
            console.log(err)
        }
        if(usrDoc.length == 0){
            const user = new User({
                name: _user,
                password: _pwd
            });
            user.save(function(err,user){
                if(err) {
                    console.log(err)
                }
                res.json({
                    code: 1,
                    msg: '注册成功'
                });
            })
        }else{
            res.json({
                code: 0,
                msg: '用户名已经存在，请重新输入~'
            });
            return;
        }
    })
})

// 登录
router.post('/signin', async function (req, res, next) {
    const rsb = req.body;
    const _user = rsb.user;
    const _pwd = rsb.pwd;
     
    await User.findOne({name: _user}).exec(function(err,usrDoc){
        if (!usrDoc) {
            res.json({
                code: 0,
                msg: '当前账户未注册，请重新输入'
            });
            return;
        }else{
            usrDoc.comparePassword(_user,_pwd,function(err,isMatched){
                if(isMatched){
                    req.session.user = usrDoc;
                    res.json({
                        user: usrDoc.name,
                        code: 1,
                        msg: '登录成功'
                    });
                }else{
                    res.json({
                        code: 0,
                        msg: '密码错误，请重新输入'
                    });
                }
            })
        }
    })
    
})

// 登出
router.get('/logout', function (req, res, next) {
    delete req.session.user;
    // console.log('logoutsucc')
    res.json({
        code: 1,
        msg: '登出成功'
    });
    
})


module.exports = router;