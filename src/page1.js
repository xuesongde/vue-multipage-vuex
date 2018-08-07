// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './views/page1/index.vue'
import store from './store/page1'

// Resource
Vue.use(VueResource)

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

// 配置 resource
Vue.http.options.root = ''
Vue.http.options.emulateJSON = false
Vue.http.options.headers = {
  'Content-Type': 'application/json;charset=utf-8'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
