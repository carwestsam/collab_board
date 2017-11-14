import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'

Vue.use(Vuex)

const INIT_ONBOARD_STICKER = 10
const INIT_ONHAND_STICKER = 2
const INIT_ONBOARD_GROUP = 2

let getStore = function () {
  return new Vuex.Store({
    state: {
      items: [],
      onHand: []
    },
    mutations: {
      randomStickers: (state, data) => {
        let getRandomInt = obj.getRandomInt
        state.stickers = []
        for (let i = 0; i < INIT_ONBOARD_GROUP; i++) {
          state.items.push({
            id: uuid(),
            type: 'group',
            bg_color: '#' + getRandomInt(0, 0xffffff).toString(16),
            text: 'group',
            left: getRandomInt(0, 1000),
            top: getRandomInt(0, 1000),
            stack: 'board'
          })
        }
        for (let i = 0; i < INIT_ONBOARD_STICKER; i++) {
          state.items.push({
            id: uuid(),
            type: 'sticker',
            bg_color: '#' + getRandomInt(0, 0xffffff).toString(16),
            text: 'Hello World',
            left: getRandomInt(0, 1000),
            top: getRandomInt(0, 1000),
            stack: 'board'
          })
        }
        for (let i = 0; i < INIT_ONHAND_STICKER; i++) {
          state.items.push({
            id: uuid(),
            type: 'sticker',
            bg_color: '#' + getRandomInt(0, 0xffffff).toString(16),
            text: 'on Hand',
            stack: 'hand'
          })
        }
      },
      deleteItem: (state, {id}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            state.items.splice(i, 1)
            return
          }
        }
      },
      moveStickerToBoard: (state, {id, top, left}) => {
        let newUUID = uuid()
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].stack === id) {
            state.items[i].stack = newUUID
          }
        }
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            let sticker = _.cloneDeep(state.items[i])
            sticker.left = left
            sticker.top = top
            sticker.id = newUUID
            sticker.stack = 'board'
            state.items.splice(i, 1)
            state.items.push(sticker)
            return
          }
        }
      },
      moveStickerToHand: (state, {id}) => {
        let newUUID = uuid()
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].stack === id) {
            state.items[i].stack = newUUID
          }
        }
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            let sticker = _.cloneDeep(state.items[i])
            sticker.id = newUUID
            sticker.stack = 'hand'
            state.items.splice(i, 1)
            state.items.push(sticker)
            return
          }
        }
      },
      moveItem: (state, {id, itemId}) => {
        if (id === itemId) {
          return
        }
        let newUUID = uuid()
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].stack === itemId) {
            state.items[i].stack = newUUID
          }
        }
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === itemId) {
            let sticker = _.cloneDeep(state.items[i])
            sticker.id = newUUID
            sticker.stack = id
            state.items.splice(i, 1)
            state.items.push(sticker)
            return
          }
        }
      },
      addStickerToHand: (state) => {
        state.items.push({
          id: uuid(),
          type: 'sticker',
          bg_color: '#' + obj.getRandomInt(0, 0xffffff).toString(16),
          text: 'New Sticker',
          stack: 'hand'
        })
      },
      updateStickerText: (state, {id, text}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            state.items[i].text = text
            break
          }
        }
      }
    },
    getters: {
      stickers: (state) => {
        return state.items.filter(sticker => sticker.stack === 'board')
      },
      onHand: (state) => {
        return state.items.filter(sticker => sticker.stack === 'hand')
      },
      getStickerById: (state) => (id) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            return _.cloneDeep(state.items[i])
          }
        }
      },
      items: (state) => (stack = 'board') => {
        return state.items.filter(item => item.stack === stack)
      }
    }
  })
}

export default getStore
