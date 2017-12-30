// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import './directives'
import kb from 'keyboardjs'
import {StateHistoryMgr} from './store/StateHistoryManager'
import SocketManager from './store/SocketManager'
import Vuetify from 'vuetify'

Vue.config.productionTip = false
Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  template: '<App/>',
  components: { App },
  mounted: function () {
    kb.bind('win + z', function (e) {
      StateHistoryMgr.getInstance().undo()
    })
    kb.bind('win + shift + z', function (e) {
      StateHistoryMgr.getInstance().redo()
    })
    kb.bind('ctrl + s', function (e) {
      SocketManager.getInstance().send('save', '')
      console.log('save')
    })
  }
})
