<template>
  <div class="col-md-3 sidebar">
    <ul class="list-group ">
        <li class="list-group-item" v-for="zone in zoneList">
            <span class="zoneName">{{zone.name}}</span>
            <span class="riseRate">{{zone.priceRateHalfY}}</span>
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
    }
  },
  mounted(){
    messageBus.$on('transZone',(zoneObj)=>{
       this.zoneList = zoneObj;
    })
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
  padding-right:0;
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
