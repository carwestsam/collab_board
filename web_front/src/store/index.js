import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'
import {VuexConfigGenerator, StateHistoryMgr} from './StateHistoryManager'
import {mutationDesciption} from '../../../shared_components/mutationDescription'
import {getRandomColor} from '../../../shared_components/colorGenerator'
Vue.use(Vuex)

const INIT_ONBOARD_STICKER = 20
const INIT_ONHAND_STICKER = 0
const INIT_ONBOARD_GROUP = 1

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

new VuexConfigGenerator(storeDes).attachMutations(mutationDesciption)

let getStore = function () {
  let store = new Vuex.Store(storeDes)
  StateHistoryMgr.getInstance().setState(store.state)
  return store
}

export default getStore
