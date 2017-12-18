import uuid from 'uuid/v4'
import {getRandomColor} from './colorGenerator.mjs'
import _ from 'lodash'

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

export let mutationDesciption = {
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
}