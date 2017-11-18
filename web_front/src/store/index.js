import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'
import {VuexConfigGenerator} from './StateHistoryManager'

Vue.use(Vuex)

const INIT_ONBOARD_STICKER = 1
const INIT_ONHAND_STICKER = 0
const INIT_ONBOARD_GROUP = 1

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

function findItemById (state, id) {
  for (let i = 0; i < state.items.length; i++) {
    if (state.items[i].id === id) {
      return {
        item: state.items[i],
        idx: i
      }
    }
  }
}

function updateStack (state, oldStack, newStack) {
  for (let i = 0; i < state.items.length; i++) {
    if (state.items[i].stack === oldStack) {
      state.items[i].stack = newStack
    }
  }
}

new VuexConfigGenerator(storeDes).attachMutations({
  deleteItem: function () {
    return {
      forward: (capsule, state, {id}) => {
        let {item, idx} = findItemById(state, id)
        capsule['item'] = _.cloneDeep(item)
        capsule['index'] = idx
        state.items.splice(idx, 1)
      },
      backward: (capsule, state, {id}) => {
        state.items.splice(capsule['index'], 0, _.cloneDeep(capsule['item']))
      }
    }
  },
  updateStickerText: function () {
    return {
      forward: (capsule, state, {id, text}) => {
        let {item} = findItemById(state, id)
        let newId = capsule['newId'] || uuid()
        capsule['text'] = item.text
        capsule['id'] = item.id
        item.id = capsule['newId'] = newId
        item.text = text
        updateStack(state, capsule['id'], capsule['newId'])
      },
      backward: (capsule, state, {id, text}) => {
        let {item} = findItemById(state, capsule['newId'])
        item.text = capsule['text']
        item.id = capsule['id']
        updateStack(state, capsule['newId'], capsule['id'])
      }
    }
  },
  moveItemToBoard: function () {
    return {
      forward: (capsule, state, {id, top, left}) => {
        let newId = capsule['newId'] || uuid()
        updateStack(state, id, newId)
        let {item, idx} = findItemById(state, id)
        let newItem = _.cloneDeep(item)
        capsule['item'] = _.cloneDeep(item)
        capsule['index'] = idx
        capsule['newId'] = newId
        newItem.left = left
        newItem.top = top
        newItem.id = newId
        newItem.stack = 'board'
        state.items.splice(idx, 1)
        state.items.push(newItem)
      },
      backward: (capsule, state, {id, top, left}) => {
        state.items.splice(capsule['index'], 0, _.cloneDeep(capsule['item']))
        let {idx} = findItemById(state, capsule['newId'])
        state.items.splice(idx, 1)
      }
    }
  }
})

let getStore = function () {
  return new Vuex.Store(storeDes)
}

export default getStore
