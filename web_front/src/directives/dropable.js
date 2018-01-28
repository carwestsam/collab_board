import DragManager from './draggable'
import _ from 'lodash'
import SelectMgr from './selectable'
import Vue from 'vue'
import {store} from '../store/index'
let selectMgr = SelectMgr.getInstance()

let dropManager = null

function isRectHit (left, top, rect) {
  if (rect.left < left && rect.top < top && rect.left + rect.width > left && rect.top + rect.height > top) {
    return true
  } else {
    return false
  }
}

class DropManager {
  constructor () {
    this.dropFunctions = {}
    this.elements = {}
  }
  static getInstance () {
    if (dropManager === null) {
      dropManager = new DropManager()
    }
    return dropManager
  }
  registerDrop (id, vnode, el, dropHandler) {
    this.dropFunctions[id] = dropHandler
    this.elements[id] = el
  }
  unregisterDrop (id, vnode) {
    this.elements[id].removeEventListener('drop', this.dropFunctions[id])
    delete this.dropFunctions[id]
  }
  drop (id, left, top, ev) {
    // console.log('drop', id, left, top, ev)
    // drop on hand
    let handId = 'hand-' + store.getters.userId
    let handRect = this.elements[handId].getBoundingClientRect()
    if (isRectHit(left, top, handRect)) {
      this.dropFunctions[handId](ev)
      return true
    }

    // drop on board
    let items = store.getters.allItemsWithStack
    let itemStackDict = {}
    for (let i = 0; i < items.length; i += 1) {
      itemStackDict[items[i].id] = {stack: items[i].stack, index: i}
    }
    let shoots = []
    _.forEach(this.elements, (el, id) => {
      let rect = el.getBoundingClientRect()
      if (isRectHit(left, top, rect)) {
        shoots.push({id})
      }
    })
    let target = ''
    let maxRootIndex = -1
    let maxLayer = -1
    let maxIndex = -1
    for (let i = 0; i < shoots.length; i++) {
      let id = shoots[i].id
      let item = itemStackDict[id]
      shoots[i].index = item.index
      let stack = id
      let layer = 1
      while (itemStackDict[stack].stack !== 'board') {
        stack = itemStackDict[stack].stack
        layer += 1
      }
      shoots[i].rootIndex = itemStackDict[stack].index
      shoots[i].layer = layer

      if ((shoots[i].rootIndex > maxRootIndex) ||
          (shoots[i].rootIndex === maxRootIndex && shoots[i].layer > maxLayer) ||
          (shoots[i].rootIndex === maxRootIndex && shoots[i].layer === maxLayer && shoots[i].index > maxIndex)) {
        maxRootIndex = shoots[i].rootIndex
        maxLayer = shoots[i].layer
        maxIndex = shoots[i].index
        target = id
      }
    }
    // console.log('finish drop:', items, shoots, target)
    if (target.length !== 0 && target !== id) {
      this.dropFunctions[target](ev)
      return true
    } else {
      return false
    }
  }
}

dropManager = DropManager.getInstance()
window.dropManager = dropManager
export default DropManager

function isDefined (obj) {
  return typeof obj !== 'undefined'
}

function isDeskItem (vnode) {
  return isDefined(vnode.context.dataProps) && isDefined(vnode.context.dataProps.id)
}

function getItemId (vnode) {
  if (!isDeskItem(vnode)) {
    console.error('is not desktop Item for getItemId')
    return null
  } else {
    return vnode.context.dataProps.id
  }
}

Vue.directive('dropable', {
  bind: function (el, binding, vnode) {
    let callbackFunc = binding.value
    if (!(typeof callbackFunc === 'function' || typeof callbackFunc === 'undefined')) {
      console.error('dropable should assign value of funciton or undefined')
    }
    if (typeof callbackFunc === 'undefined') {
      callbackFunc = function () {}
    } else {
      callbackFunc = function () {
        if (isDefined(arguments[1]) && _.get(vnode, 'context.dataProps.id', undefined) === arguments[1]) {
          return
        }
        // incase some time, drag failed, should not finish Drop
        if (binding.value.apply(this, arguments)) {
          DragManager.getInstance().finishDrop()
        }
      }
    }

    let handleOverFunction = function () {
    }
    let handleOver = _.throttle(handleOverFunction, 1000)

    el.addEventListener('dragover', function (event) {
      handleOver()
      event.preventDefault()
    })
    el.addEventListener('dragenter', function (ev) {
      el.classList.add('dragover')
    })
    el.addEventListener('dragleave', function () {
      el.classList.remove('dragover')
    })

    let dropHandler = function (event) {
      el.classList.remove('dragover')
      let id = ''
      if (selectMgr.selected.length === 1 && isDeskItem(selectMgr.selected[0])) {
        id = getItemId(selectMgr.selected[0])
      }

      let e = event
      callbackFunc.apply(this, [e, id])

      if (DragManager.getInstance().dropped === true && id) {
        DragManager.getInstance().removeDocumentListeners(id, ['drag', 'dragend'])
        // console.log('e')
        selectMgr.unselectAll()
      }
      e.stopPropagation()
    }

    let itemId = _.get(vnode, 'context.dataProps.id', undefined)

    // console.log('bind', itemId)
    if (itemId) {
      dropManager.registerDrop(itemId, vnode, el, dropHandler)
    }

    el.addEventListener('drop', dropHandler)
  },

  unbind: function (el, binding, vnode) {
    // console.log('unbind drop')
    let itemId = _.get(vnode, 'context.dataProps.id', undefined)
    if (itemId) {
      dropManager.unregisterDrop(itemId)
    }
  }
})
