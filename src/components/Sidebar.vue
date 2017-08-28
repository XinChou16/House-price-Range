<template>
  <div class="col-md-3 sidebar">
    <ul class="list-group ">
        <li class="list-group-item" v-for="zone in zoneList" v-if="isZone"> 
            <span class="zoneName">{{zone.name}}</span>
            <span class="riseRate">{{zone.priceRateHalfY}}</span>
        </li>
        <li class="list-group-item" v-for="dist in zoneList" v-if="!isZone"> 
            <span class="zoneName">{{dist.district}}</span>
            <span class="riseRate">{{dist.priceRateHalfM}}</span>
        </li>
    </ul>
  </div> 

</template>

<script>
import messageBus from './messageBus'
export default {
  name: 'hello1', 
  data () {
    return {
      msg: 'Welcome to hello1',
      zoneList:[],
      isZone: false,
    }
  },

  mounted(){
    const self = this;
    messageBus.$on('transDist',(distObj)=>{
      
      this.zoneList.length = 0;
      for (let j = 0; j < distObj.length; j++) {
        this.zoneList.push({
         district: distObj[j].district,
         priceRateHalfM: distObj[j].priceRateHalfM.toFixed(0)
        })
      }
       this.isZone = false;
      
    })

    // 点击时触发
    messageBus.$on('transZone',(zoneObj)=>{
      this.zoneList.length = 0;
      for (let k = 0; k < zoneObj.length; k++) {
        this.zoneList.push({
         name: zoneObj[k].name,
         priceRateHalfY: zoneObj[k].priceRateHalfY.toFixed(0)
        })
      }
       this.isZone = true;
    });

    // 地图滚动时触发
    messageBus.$on('transMapZone',(zoneObj) =>{
      this.zoneList.length = 0;
      // const temp = [];
      // [].push.apply(temp,data);
      for (let k = 0; k < zoneObj.length; k++) {
        this.zoneList.push({
         name: zoneObj[k].name,
         priceRateHalfY: zoneObj[k].priceRateHalfY.toFixed(0)
        })
      }
       this.isZone = true;
    })


    messageBus.$on('searchZone',(data)=>{
      this.$http.post('/searchZone',{name: data}).then(function(res){
        this.zoneList.length = 0;
        for (let l = 0; l < res.body.length; l++) {
          this.zoneList.push({
            name: res.body[l].name,
            priceRateHalfY: res.body[l].priceRateHalfY.toFixed(0)
          })
        }
        self.isZone = true;
      })
    });

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
.list-group{
  // outline: 1px solid red;
}
.sidebar{
  height:600px;
  overflow:scroll;
  margin-top: -15px;
  padding-left:0;
  padding-right:20px;
}
.list-group-item{
  width:100%;
}
.zoneName{
  float:left;
}
.riseRate{
  margin-left: 80px;
}
</style>
