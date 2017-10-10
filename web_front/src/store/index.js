import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let getStore = function () {
  return new Vuex.Store({
    state: {
      _stickers: []
    },
    getters: {
      stickers: (state) => {
        return [
          {
            id: 1,
            type: 'sticker',
            bg_color: 'yellow',
            left: 100,
            top: 100
          },
          {
            id: 2,
            type: 'sticker',
            bg_color: 'red',
            left: 300,
            top: 100
          }
        ]
      }
    }
  })
}

export default getStore
