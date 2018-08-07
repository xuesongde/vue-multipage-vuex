<style>
#first {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div id="first" @click="doIt">
    第一个页面
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{

    }
  },
  methods:{
    doIt(){
      location.href='/page2.html'
    }
  }
}
</script>

