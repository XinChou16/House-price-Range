<template>
  <transition name="login" v-if="showModal">
    <div class="login-mask">
      <div class="login-wrapper">
        <div class="login-container">

          <div class="login-header">
            <slot name="header">
              <h3 slot="header" >登录</h3>
            </slot>
          </div>

          <div class="login-body">
            <slot name="body">
             <input type="text" class="form-control" v-model="name" placeholder="帐户">
            </slot>
          </div>

          <div class="login-footer">
            <slot name="footer">
             <input type="password" class="form-control" v-model="pwd" placeholder="密码">
            <input class="btn btn-default"  @click="login"  value="确定登录">
            <input class="btn btn-default"  @click="cancel" value="取消">
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import messageBus from './messageBus'
import md5 from 'md5'

export default {
  name: 'hello1',
  data () {
    return {
      showModal: false,
      name:'',
      pwd: '',
    }
  },

  mounted(){
    messageBus.$on('logInfo',(isLog)=>{ 
       if(isLog){
            this.showModal = true;
       }
    })
    
  },

  methods: {
    login: function() {
        const pwd = md5(this.pwd);
        
        this.$http.post('/signin',{
            user: this.name,
            pwd: pwd,
        }).then(function(rsp){
            messageBus.$emit('logInfoBack',rsp);
            if(rsp.body.code){
                this.showModal = false;
                this.name = '';
                this.pwd = '';
            }else{
                this.showModal = true;
            }
        })
    },

    cancel: function () {
        this.showModal = false;
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
.login-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.login-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.login-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.login-header h3 {
  margin-top: 0;
  color: #42b983;
}

.login-body {
  margin: 20px 0;
}

.login-default-button {
  float: right;
}
.btn{
    margin-top: 10px;
    width: 100%;
    color: #fff;
    background-color: #42b983;
    border-color: #42b983;
}
.btn:hover{
    color: #42b983;
    background-color: #fff;
}
/*
 * The following styles are auto-applied to elements with
 * transition="login" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the login transition by editing
 * these styles.
 */

.login-enter {
  opacity: 0;
}

.login-leave-active {
  opacity: 0;
}

.login-enter .login-container,
.login-leave-active .login-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
