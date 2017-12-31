import uuid from 'uuid/v4'
import {getRandomColor} from './colorGenerator.mjs'
import _ from 'lodash'
import log from './log.mjs'

function findItemById (state, id) {
  for (let i = 0; i < state.items.length; i++) {
    if (state.items[i].id === id) {
      return {
        item: state.items[i],
        idx: i
      }
    }
  }
  console.log(`could not find item in ${JSON.stringify(state)} by id ${id}`)
}

function updateStack (state, oldStack, newStack) {
  if (!state || !state.items || !state.items.length ) {
    log('invalid state', state)
  }
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
  resizeItem: function () {
    return {
      forward: (capsule, state, {id, width, height}) => {
        let {item} = findItemById(state, id)
        let newId = capsule['newId'] || uuid()
        capsule['width'] = item.width
        capsule['height'] = item.height
        capsule['id'] = item.id
        item.id = capsule['newId'] = newId
        item.width = width
        item.height = height
        updateStack(state, capsule['id'], capsule['newId'])
      },
      backward: (capsule, state, {id, width, height}) => {
        let {item} = findItemById(state, capsule['newId'])
        item.id = capsule['id']
        item.width = capsule['width']
        item.height = capsule['height']
        updateStack(state, capsule['newId'], capsule['id'])
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
  },
  likeItem: function () {
    return {
      forward: (capsule, state, {itemId, userId, like}) => {
        let {item} = findItemById(state, itemId)
        let newId = capsule['newId'] || uuid()
        capsule['id'] = itemId
        capsule['userId'] = userId
        capsule['like'] = like
        capsule['item'] = _.cloneDeep(item)
        item.id = capsule['newId'] = newId
        if (like) {
          item['likes'] = _.union(_.get(item, 'likes', []), [userId])     
        } else {
          item['likes'] = _.without(_.get(item, 'likes', []), userId)
        }
        updateStack(state, capsule['id'], capsule['newId'])
      },
      backward: (capsule, state, {itemId, userId, like}) => {
        let {item} = findItembyId(state, capsule['newId'])
        if (item) {
          _.remove(state.items, item => item.id === capsule['newId'])  
        }
        state.items.push(_.cloneDeep(capsule['item']))
      }
    }
  }
}
