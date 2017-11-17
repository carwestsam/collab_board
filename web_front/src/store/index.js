import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'
import {VuexConfigGenerator} from './StateHistoryManager'

Vue.use(Vuex)

const INIT_ONBOARD_STICKER = 20
const INIT_ONHAND_STICKER = 0
const INIT_ONBOARD_GROUP = 0

let storeDes = {
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
    addItem: (state, {type, stack}) => {
      state.items.push({
        id: uuid(),
        type,
        bg_color: '#' + obj.getRandomInt(0, 0xffffff).toString(16),
        text: 'New ' + type,
        stack
      })
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
}

new VuexConfigGenerator(storeDes).attachMutations({
  deleteItem: function () {
    return {
      forward: (capsule, state, {id}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            capsule['item'] = _.cloneDeep(state.items[i])
            capsule['index'] = i
            state.items.splice(i, 1)
            return
          }
        }
      },
      backward: (capsule, state, {id}) => {
        state.items.splice(capsule['index'], 0, _.cloneDeep(capsule['item']))
      }
    }
  },
  updateStickersStack: function () {
    return {
      forward: (capsule, state, {id, newId}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].stack === id) {
            state.items[i].stack = newId
          }
        }
      },
      backward: (capsule, state, {id, newId}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].stack === newId) {
            state.items[i].stack = id
          }
        }
      }
    }
  },
  updateStickerText: function () {
    return {
      forward: (capsule, state, {id, text}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === id) {
            let id = capsule['newId'] || uuid()
            let item = state.items[i]
            capsule['text'] = item.text
            capsule['id'] = item.id
            capsule['newId'] = id
            state.items[i].id = id
            state.items[i].text = text
            for (let i = 0; i < state.items.length; i++) {
              if (state.items[i].stack === capsule['id']) {
                state.items[i].stack = id
              }
            }
            break
          }
        }
      },
      backward: (capsule, state, {id, text}) => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === capsule['newId']) {
            state.items[i].text = capsule['text']
            state.items[i].id = capsule['id']
            for (let i = 0; i < state.items.length; i++) {
              if (state.items[i].stack === capsule['newId']) {
                state.items[i].stack = capsule['id']
              }
            }
            break
          }
        }
      }
    }
  }
})

let getStore = function () {
  return new Vuex.Store(storeDes)
}

export default getStore
