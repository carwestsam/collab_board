import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'

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
        for (let i = 0; i < 10; i++) {
          state.stickers.push({
            id: uuid(),
            type: 'sticker',
            bg_color: '#' + getRandomInt(0, 0xffffff).toString(16),
            text: 'Hello World',
            left: getRandomInt(0, 1000),
            top: getRandomInt(0, 1000)
          })
        }
      },
      moveSticker: (state, {id, top, left}) => {
        for (let i = 0; i < state.stickers.length; i++) {
          if (state.stickers[i].id === id) {
            let sticker = _.cloneDeep(state.stickers[i])
            sticker.left = left
            sticker.top = top
            sticker.id = uuid()
            console.log('updated:', JSON.stringify(sticker))
            state.stickers.splice(i, 1)
            state.stickers.push(sticker)
            return
          }
        }
      },
      updateStickerText: (state, {id, text}) => {
        for (let i = 0; i < state.stickers.length; i++) {
          if (state.stickers[i].id === id) {
            state.stickers[i].text = text
            break
          }
        }
      }
    },
    getters: {
      stickers: (state) => {
        return state.stickers
      },
      getStickerById: (state) => (id) => {
        for (let i = 0; i < state.stickers.length; i++) {
          if (state.stickers[i].id === id) {
            return _.cloneDeep(state.stickers[i])
          }
        }
      }
    }
  })
}

export default getStore