<template>
  
<div class="header navbar">
    <div class="col-md-5">
        <a class="navbar-brand slogan" href="#">好多房</a>
        <form class="navbar-form navbar-left" onsubmit="return false">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="输入小区名开始找房" v-model="zoneFind">
            </div>
            <button type="submit" class="btn btn-default" @click="search">开始找房</button>
        </form>
    </div> 
    <div class="col-md-3 dist">
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
        <li><a href="javascript:void(0)"                v-if="!isLogin">欢迎~{{user}}</a></li>
        <li><a href="javascript:void(0)" @click = "logout" v-if="!isLogin">退出</a></li>
    </ul>

</div>
</template>
 
<script>

import messageBus from './messageBus'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      districtName: [
          {name:'浦东'},
          {name:'闵行'},
          {name:'宝山'},
          {name:'徐汇'},
          {name:'普陀'},
          {name:'杨浦'},
          {name:'长宁'},
          {name:'松江'},
          {name:'嘉定'},
          {name:'黄埔'},
          {name:'静安'},
        //   {name:'闸北'}, 
          {name:'虹口'},
          {name:'青浦'},
          {name:'奉贤'},
          {name:'金山'},
          {name:'崇明'},
      ],
      selected:'浦东',
      isLogin: true,
      user: '',
      zoneFind:'',
    }
  },

  mounted() {
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
            //   console.log(res)
            // 成功登录后返回，视图
            if(rsb.code){
                self.user = rsb.user;
                self.isLogin = false;
            }
        });
    },

    logout: function() {
      this.$http.get('/logout').then(function(data){
        //   console.log(data.body.msg)
          if(data.body.code){
            // 视图
            this.isLogin = true;
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

</style>
