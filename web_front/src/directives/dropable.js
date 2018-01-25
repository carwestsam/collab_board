import DragManager from './draggable'
import _ from 'lodash'
import SelectMgr from './selectable'
import Vue from 'vue'
let selectMgr = SelectMgr.getInstance()
let dragManager = DragManager.getInstance()

let dropManager = null

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
          dragManager.finishDrop()
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

      if (dragManager.dropped === true && id) {
        dragManager.removeDocumentListeners(id, ['drag', 'dragend'])
        // console.log('e')
        selectMgr.unselectAll()
      }
      e.stopPropagation()
    }

    let itemId = _.get(vnode, 'context.dataProps.id', undefined)

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
