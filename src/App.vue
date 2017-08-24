<template>
  <div id="app">
    <Navbar></Navbar>
    <Sidebar></Sidebar>
    <fangMap></fangMap>
    <modal></modal>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import fangMap from './components/fangMap'
import modal from './components/modal'


export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar,
    fangMap,
    modal,
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
