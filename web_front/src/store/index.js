import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'

Vue.use(Vuex)

let getStore = function () {
  return new Vuex.Store({
    state: {
      stickers: []
    },
    mutations: {
      randomStickers: (state, data) => {
        let getRandomInt = obj.getRandomInt
        state.stickers = []
        for (let i = 0; i < 50; i++) {
          state.stickers.push({
            id: i,
            type: 'sticker',
            bg_color: '#' + getRandomInt(0, 0xffffff).toString(16),
            left: getRandomInt(0, 1000),
            top: getRandomInt(0, 1000)
          })
        }
      }
    },
    getters: {
      stickers: (state) => {
        return state.stickers
      }
    }
  })
}

export default getStore
