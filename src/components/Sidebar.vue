<template>
  <div class="col-md-2">
    <ul class="list-group text-center">
        <li class="list-group-item">
            正荣大湖之都<span class="riseRate">200</span>
        </li>
        <li class="list-group-item">
            正荣大湖之都<span class="riseRate">200</span>
        </li>
        <li class="list-group-item">
            正荣大湖之都<span class="riseRate">200</span>
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
      msg: 'Welcome to hello1'
    }
  },
  mounted(){
    messageBus.$on('submitMsg',(data)=>{
       console.log('data',data);
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
  outline: 1px solid red;
}
.riseRate{
  margin-left: 10px;
}
</style>
