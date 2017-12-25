import Vue from 'vue'
import SelectMgr from './selectable'
// import log from '../../../shared_components/log.mjs'
import _ from 'lodash'
let selectMgr = SelectMgr.getInstance()

let dragManager = null

function isDefined (obj) {
  return typeof obj !== 'undefined'
}

function isUndefined (obj) {
  return typeof obj === 'undefined'
}

function isDeskItem (vnode) {
  return isDefined(vnode.context.dataProps) && isDefined(vnode.context.dataProps.id)
}

function getItemId (vnode) {
  if (!isDeskItem(vnode)) {
    console.error('is not desktop Item for getItemId')
  } else {
    return vnode.context.dataProps.id
  }
}

class DragManager {
  constructor () {
    this.dropped = false
    this.dragFunctions = {}
  }
  static getInstance () {
    if (dragManager === null) {
      dragManager = new DragManager()
    }
    return dragManager
  }
  onDragStart (id, event, $this) {
    if (!isDefined(this.dragFunctions[id])) {
      console.error('drag Start function not initilized')
      return
    }
    this.dragFunctions[id].dragstart.call($this, event)
  }
  init () {
    this.dropped = false
  }
  bindDrag (el, vnode) {
    let id = vnode.context.dataProps.id
    if ((isDefined(this.dragFunctions[id]) && _.get(this.dragFunctions, id + '.$el', undefined) !== el)) {
      _.get(this.dragFunctions, id + '.$el', undefined).removeEventListener('dragstart',
        _.get(this.dragFunctions, id + '.startBody', undefined))
      delete this.dragFunctions[id]
    }
    if (isUndefined(this.dragFunctions[id])) {
      let funcBody = function (event) {
        dragManager.onDragStart(id, event, this)
        event.stopPropagation()
      }
      el.addEventListener('dragstart', funcBody)
      this.dragFunctions[id] = {$el: el, startBody: funcBody}
    }
    let dragDelegate = this.dragFunctions[id]
    initDrag(vnode, dragDelegate)
  }
  finishDrop () {
    this.dropped = true
  }
  removeDocumentListeners (vnode, eventTypes) {
    // if (window.DEBUG === true) {
    //   debugger
    // }
    let id = 'undefinedx'
    if (typeof vnode === 'string') {
      id = vnode
    } else {
      id = getItemId(vnode)
    }
    eventTypes.map(et => {
      document.removeEventListener(et, this.dragFunctions[id][et])
      delete this.dragFunctions[id][et]
    })
  }
  removeElementListeners (vnode, el, eventTypes) {
    let id = ''
    if (typeof vnode === 'string') {
      id = vnode
    } else {
      id = getItemId(vnode)
    }
    eventTypes.map(et => {
      el.removeEventListener(et, this.dragFunctions[id][et])
      delete this.dragFunctions[id][et]
    })
  }
}

dragManager = new DragManager()
window.dragManager = dragManager

function initDrag (vnode, delegate) {
  let dragStart = function (event) {
    let id = vnode.context.dataProps.id

    dragManager.init()
    let $this = this
    let moved = false
    let targetLeft = this.style.left
    let targetTop = this.style.top
    let offsetX = event.offsetX
    let offsetY = event.offsetY

    if (selectMgr.selected.length === 0) {
      selectMgr.selectElement(vnode)
    }

    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('text/plain', vnode.context.dataProps.text)

    let MouseMove = function (event) {
      // log('move')
      if (moved === false) {
        moved = true
      }
      if (!(event.screenX === 0 && event.screenY === 0)) {
        let $app = document.getElementById('application')
        targetLeft = $app.scrollLeft + event.clientX - offsetX - 10
        targetTop = $app.scrollTop + event.clientY - offsetY - 10
        // log('move', $app.scrollLeft, $app.scrollTop, targetLeft, targetTop)
        // debugger
      }
    }

    let MouseUp = function (event) {
      if (dragManager.dropped === false && moved === true) {
        selectMgr.selected[0].context.$store.commit('moveItem',
          {
            id: id,
            top: parseInt(targetTop),
            left: parseInt(targetLeft),
            stack: 'board'
          })
        selectMgr.unselectAll()
        dragManager.dropped = true

        dragManager.removeDocumentListeners(id, ['drag', 'dragend'])
        dragManager.removeElementListeners(id, $this, ['dragstart'])
      }
    }
    delegate.drag = MouseMove
    delegate.dragend = MouseUp
    document.addEventListener('drag', delegate.drag)
    document.addEventListener('dragend', delegate.dragend)
  }
  delegate.dragstart = dragStart
}

Vue.directive('draggable', {
  bind: function (el, binding, vnode) {
    el.setAttribute('draggable', '' + binding.value)
    if (binding.value === true) {
      dragManager.bindDrag(el, vnode)
    }
  },
  update: function (el, binding, vnode) {
    if (binding.value === true) {
      dragManager.bindDrag(el, vnode)
    }
  }
})

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
        dragManager.finishDrop()
        binding.value.apply(this, arguments)
      }
    }

    let handleOverFunction = function () {
    }
    let handleOver = _.throttle(handleOverFunction, 1000)

    el.addEventListener('dragover', function (event) {
      handleOver()
      event.preventDefault()
    })
    el.addEventListener('dragenter', function () {
      el.classList.add('dragover')
    })
    el.addEventListener('dragleave', function () {
      el.classList.remove('dragover')
    })
    el.addEventListener('drop', function (event) {
      el.classList.remove('dragover')
      let id = ''
      if (selectMgr.selected.length === 1 && isDeskItem(selectMgr.selected[0])) {
        id = getItemId(selectMgr.selected[0])
      }

      let e = event
      callbackFunc.apply(this, [e, id])

      if (dragManager.dropped === true && id) {
        dragManager.removeDocumentListeners(id, ['drag', 'dragend'])
        selectMgr.unselectAll()
        // dragManager.removeElementListeners(id, el, ['dragstart'])
      }
      e.stopPropagation()
    })
  }
})
