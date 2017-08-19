<template>
  
<div class="header navbar">
    <div class="col-md-5">
        <a class="navbar-brand slogan" href="#">上海房价房价</a>
        <form class="navbar-form navbar-left" onsubmit="return false">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="输入小区名开始找房">
            </div>
            <button type="submit" class="btn btn-default" @click="submit">开始找房</button>
        </form>
    </div> 
    <div class="col-md-3 dist">
        <p href="#" class="dist-title">区域选择</p>
        <div class="dist-wrap">
            <select name="" id="districtChoose">
                <option value="浦东">浦东</option>
                <option value="闵行">闵行</option>
                <option value="宝山">宝山</option>
                <option value="徐汇">徐汇</option>
                <option value="普陀">普陀</option>
                <option value="杨浦">杨浦</option>
                <option value="长宁">长宁</option>
                <option value="松江">松江</option>
                <option value="嘉定">嘉定</option>
                <option value="黄埔">黄埔</option>
                <option value="静安">静安</option>
                <option value="闸北">闸北</option>
                <option value="虹口">虹口</option>
                <option value="青浦">青浦</option>
                <option value="奉贤">奉贤</option>
                <option value="金山">金山</option>
                <option value="崇明">崇明</option>
            </select>
            <i class="dropdown"></i>
        </div>
    </div>
</div>
</template>

<script>

import messageBus from './messageBus'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    submit:function(){
      console.log('i am navbar');
      messageBus.$emit('submitMsg','I am a message');// 组件通信
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
     outline: 1px solid red; 
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

</style>
