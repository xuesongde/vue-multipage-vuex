import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.devtools = true

const state = {}
const mutations = {}
const actions = {}
const getter = {}

export default new Vuex.Store({
  state,
  getter,
  mutations,
  actions
})