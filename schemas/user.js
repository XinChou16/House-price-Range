  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var md5 = require('md5');

// var RANDOM_NUMBER = parseInt(Math.random()*1000000+1000000);
var RANDOM_NUMBER = 100000;

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    password: String,
    // role: { 
    //   type: Number,
    //   default: 0
    // },
    // 0 normal usr
    // 1 verified usr
    // 2 VIP usr

    meta: {
        createdAt: {
          type: Date,
          default: Date.now()
        },
        updatedAt: {
          type: Date,
          default: Date.now()
        }
      }
})



UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
      this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
      this.meta.updatedAt = Date.now();
    }
    //  加密 => md5(username+md5(pwd)+sault)
    var classified = user.name + md5(user.password) + RANDOM_NUMBER;
    user.password = md5(classified);
    
    next()
  });
  
// 实例方法
UserSchema.methods = {
  comparePassword: function (name,pwd,cb){
    var _pwd = md5(name + md5(pwd) + RANDOM_NUMBER);
    
    if(_pwd === this.password){
      var isMatch = true;
    }else{
      var isMatch = false;
    }

    cb(null,isMatch);
    
  }
}

// 静态方法
  UserSchema.statics = {
    fetch: function (callback) {
      return this.find({}).sort('meta.updatedAt').exec(callback);
    },
  
    findById: function (id, callback) {
      return this.findOne({_id: id}).exec(callback);
    }
  };
  


module.exports = UserSchema;
