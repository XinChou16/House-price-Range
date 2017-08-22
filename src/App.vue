<template>
  <div id="app">
    <Navbar></Navbar>
    <Sidebar></Sidebar>
    <fangMap></fangMap>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import fangMap from './components/fangMap'


export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar,
    fangMap,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
