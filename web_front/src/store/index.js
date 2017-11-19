import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'
import * as d3 from 'd3-color'
import {VuexConfigGenerator, StateHistoryMgr} from './StateHistoryManager'

Vue.use(Vuex)

const INIT_ONBOARD_STICKER = 20
const INIT_ONHAND_STICKER = 0
const INIT_ONBOARD_GROUP = 1

let stickerRotater = 0
let groupRotater = 0
function getRandomColor (type) {
  if (type === 'sticker') {
    stickerRotater = (stickerRotater + 137.5) % 360
    // return `hsl(${stickerRotater}, 100%, 70%)`
    let h = stickerRotater
    let s = 80
    let l = 90
    let result = d3.hcl(h, s, l).toString()
    console.log('color', result)
    return result
  } else if (type === 'group') {
    groupRotater = (groupRotater + 45.83) % 360
    return `hsl(${groupRotater}, 100%, 95%)`
  }
}

let storeDes = {
  state: {
    items: []
  },
  mutations: {
    initItems: (state, data) => {
      if (typeof data !== 'undefined') {
        state.items = _.cloneDeep(data.items)
        return
      }
      let getRandomInt = obj.getRandomInt
      state.stickers = []
      for (let i = 0; i < INIT_ONBOARD_GROUP; i++) {
        state.items.push({
          id: uuid(),
          type: 'group',
          bg_color: getRandomColor('group'),
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
          bg_color: getRandomColor('sticker'),
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
          bg_color: getRandomColor('sticker'),
          text: 'on Hand',
          stack: 'hand'
        })
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
  moveItem: function () {
    return {
      forward: (capsule, state, {id, top, left, stack}) => {
        let newId = capsule['newId'] || uuid()
        updateStack(state, id, newId)
        let {item, idx} = findItemById(state, id)
        let newItem = _.cloneDeep(item)
        capsule['item'] = _.cloneDeep(item)
        capsule['index'] = idx
        capsule['newId'] = newId
        newItem.left = left || 0
        newItem.top = top || 0
        newItem.id = newId
        newItem.stack = stack
        state.items.splice(idx, 1)
        state.items.push(newItem)
      },
      backward: (capsule, state, {id, top, left, stack}) => {
        updateStack(state, capsule['newId'], id)
        state.items.splice(capsule['index'], 0, _.cloneDeep(capsule['item']))
        let {idx} = findItemById(state, capsule['newId'])
        state.items.splice(idx, 1)
      }
    }
  },
  addItem: function () {
    return {
      forward: (capsule, state, {type, stack}) => {
        let newId = capsule['newId'] || uuid()
        capsule['newId'] = newId
        state.items.push({
          id: newId,
          type,
          bg_color: getRandomColor(type),
          text: 'New ' + type,
          stack
        })
      },
      backward: (capsule, state, {type, stack}) => {
        let {idx} = findItemById(state, capsule['newId'])
        state.items.splice(idx, 1)
      }
    }
  }
})

let getStore = function () {
  let store = new Vuex.Store(storeDes)
  StateHistoryMgr.getInstance().setState(store.state)
  return store
}

export default getStore
