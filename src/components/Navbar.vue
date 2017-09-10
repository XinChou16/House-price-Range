<template>
  <nav class="navbar navbar-default header">
  <div class="container-fluid">

    <div class="navbar-header">
      <span class="navbar-brand" href="#">大数据找房</span>
    </div>
   
    <form class="navbar-form navbar-left" style="width:40%;" onsubmit="return false">
        <div class="form-group" style="width: 50%;">
                <input type="text" class="form-control" placeholder="输入小区名开始找房" v-model="zoneFind">
        </div>
        <button type="submit" class="btn btn-default" @click="search">开始找房</button>
     </form>
     
     <div class="dist">
         <p href="#" class="dist-title">区域选择</p>
         <div class="dist-wrap">
             <select name="" id="districtChoose" v-on:change="getDistInfo(selected)" v-model="selected">
                 <option v-for="(dist,index) in districtName" v-bind:value="dist.name">{{ dist.name }}</option>
             </select>
             <i class="dropdown"></i>
         </div>
     </div>
    
    <ul class="nav navbar-nav navbar-right">
        <li><a href="javascript:void(0)" @click = "login" v-if="isLogin">登录</a></li>
        <li><a href="javascript:void(0)" @click = "reg" v-if="isLogin">注册</a></li>
        <li><a href="javascript:void(0)"                v-if="isLogin">欢迎~{{user}}</a></li>
        <li><a href="javascript:void(0)" @click = "logout" v-if="isLogin">退出</a></li>
    </ul>
   
  </div>
</nav>
</template>
 
<script>

import messageBus from './messageBus'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      districtName: [
          {name:'南山'},
          {name:'罗湖'},
          {name:'福田'},
          {name:'盐田'},
          {name:'龙岗'},
          {name:'宝安'},
          {name:'坪山新区'},
          {name:'龙华新区'},
          {name:'光明新区'},
          {name:'大鹏新区'},
      ],
      selected:'南山',
      isLogin: 0,
      user: '',
      zoneFind:'',
    }
  },

  mounted() {
      this.$http.get('/get').then(function(req){
          if(req.body){
              this.user = req.body.name;
              this.isLogin = false;
          }
      })
  },

  methods:{
    search:function(){
        const data = this.zoneFind
      messageBus.$emit('searchZone',data);// 组件通信
    },

    reg: function() {
      messageBus.$emit('regInfo',true);
    },

    login: function() {
        const self = this;
        messageBus.$emit('logInfo',true);
        messageBus.$on('logInfoBack',function(res){
            const rsb = res.body;
            
            // 成功登录后返回，视图
            if(rsb.code){
                alert(rsb.msg);
                self.user = rsb.user;
                self.isLogin = false;
            }else{
                alert(rsb.msg);
                return;
            }
        });
    },

    logout: function() {
      this.$http.get('/logout').then(function(data){
        //   console.log(data.body.msg)
          if(data.body.code){
            // 视图
            this.isLogin = true;
            alert(data.body.msg);
          }
      })
    },

    // 点击下拉菜单
    getDistInfo: function (dist){
        // console.log(this.selected)
        this.$http.post('/getZone',{dist:dist}).then(function(res){
            messageBus.$emit('transZone',res.body);// 传输小区信息
        },function(err){
            console.log('getzone出错了')
            console.log(err)
        })
    }



  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
    font-weight: normal;
    }

    ul {
    list-style-type: none;
    padding: 0;
    }

    li {
    display: inline-block;
    margin: 0 10px;
    }

    a {
    color: #42b983;
    }

    .title{ 
        float: left;
        margin-top: 15px;
    }
    .header{
        width: 100%;
        height: 50px;
        padding: 0 20px;
        background-color: #3cc;
    }
    .header a{
        color: #fff;
    }
    .header .dist{
        font-size: 15px;
        padding: 9px;
        /* outline: 1px solid red;  */
    }
    .header .dist select{
        height: 100%;
        width: 100%;
        border: 0;
    }
    .header .dist-title{
        color: #fff;
        padding-top: 5px;
    }
    .header .dist-wrap, .header .dist-title{
        float: left;
    }
    .header .dist-wrap{
        position: relative;
        width: 150px;
        height: 32px;
        /* overflow: hidden;   */
        /* outline: 1px solid blue;  */
    }
        
    .header .dist-wrap select{
        border-radius: 2px;
        margin-left: 20px;
        padding-left: 10px;
        cursor: pointer;
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        -ms-appearance:none;
    }

    .header .dist-wrap .dropdown{
        border: 1px solid #1fc8db;
        border-right: 0;
        border-top: 0;
        width: 7px;
        height: 7px;
        position: absolute;
        transform: rotate(-45deg);
        right: -12px; 
        top: 11px;
    }
    .header .nav>li>a:hover{
        background-color: #3dc;
    }
    .header .navbar-brand span{
        color:#fff;
    }
    .navbar-default .navbar-brand{
        color:#fff;
    }

</style>
