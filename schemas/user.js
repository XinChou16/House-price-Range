  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');

var SALT_WORK_FACTOR = 10;

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
    // 加盐方法hash
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
    
        bcrypt.hash(user.password,salt,function(err,hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        })
    })
  });
  
// 实例方法
UserSchema.methods = {
  comparePassword: function (pwd,cb){
    bcrypt.compare(pwd,this.password,function(err,isMatch){
      if(err) return cb(err);

      cb(null,isMatch)
    })
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
