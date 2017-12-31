import Vue from 'vue'
import Vuex from 'vuex'
import obj from '../utils/calcUtils.js'
import _ from 'lodash'
import uuid from 'uuid/v4'
import {VuexConfigGenerator, StateHistoryMgr} from './StateHistoryManager'
import {mutationDesciption} from '../../../shared_components/mutationDescription.mjs'
import {getRandomColor} from '../../../shared_components/colorGenerator.mjs'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const INIT_ONBOARD_STICKER = 20
const INIT_ONHAND_STICKER = 0
const INIT_ONBOARD_GROUP = 1
const USER_ID_COOKIE = 'Collaborate_board_user_id'

let storeDes = {
  state: {
    items: [],
    user: {
      id: ''
    },
    scale: 80,
    displayLike: false
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
    },
    initUser: (state) => {
      let userId = Cookies.get(USER_ID_COOKIE)
      if (typeof userId === 'undefined') {
        let userId = uuid()
        state.user.id = userId
        Cookies.set(USER_ID_COOKIE, userId)
      } else {
        state.user.id = userId
      }
    },
    setGlobalScale: (state, scale) => {
      if (scale >= 10 && scale <= 100) {
        state.scale = scale
      }
    },
    setDisplayLike: (state, displayLike) => {
      state.displayLike = displayLike
    }
  },
  getters: {
    stickers: (state) => {
      return state.items.filter(sticker => sticker.stack === 'board')
    },
    onHand: (state) => {
      return state.items.filter(sticker => sticker.stack === 'hand-' + state.user.id)
    },
    getItemById: (state) => (id) => {
      for (let i = 0; i < state.items.length; i++) {
        if (state.items[i].id === id) {
          return _.cloneDeep(state.items[i])
        }
      }
    },
    hasId: (state) => (id) => {
      for (let i = 0; i < state.items.length; i++) {
        if (state.items[i].id === id) {
          return true
        }
      }
      return false
    },
    items: (state) => (stack = 'board') => {
      return state.items.filter(item => item.stack === stack)
    },
    userId: (state) => {
      return state.user.id
    },
    scale: (state) => state.scale / 100.0,
    like: (state) => (id) => {
      let item = _.find(state.items, item => item.id === id)
      let result = _.indexOf(_.get(item, 'likes', []), state.user.id) >= 0
      return result
    },
    likes: (state) => (id) => {
      let item = _.find(state.items, item => item.id === id)
      return _.get(item, 'likes', []).length
    },
    displayLike: (state) => state.displayLike
  }
}

new VuexConfigGenerator(storeDes).attachMutations(mutationDesciption)

let getStore = function () {
  let store = new Vuex.Store(storeDes)
  StateHistoryMgr.getInstance().setState(store.state)
  return store
}

export let store = getStore()

export default getStore
