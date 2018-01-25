import Vue from 'vue'
import SelectMgr from './selectable'
import _ from 'lodash'
import {store} from '../store/index'
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
    return null
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
  onDragStart (id, ev, $this) {
    if (!isDefined(this.dragFunctions[id])) {
      console.error('drag Start function not initilized')
      return
    }
    this.dragFunctions[id].dragstart.call($this, ev)
  }
  init () {
    this.dropped = false
  }
  bindDrag (el, vnode) {
    let id = vnode.context.dataProps.id
    if ((isDefined(this.dragFunctions[id]) && _.get(this.dragFunctions, id + '.$el', undefined) !== el)) {
      console.log('in defined')
      _.get(this.dragFunctions, id + '.$el', undefined).removeEventListener('dragstart',
        _.get(this.dragFunctions, id + '.startBody', undefined))
      delete this.dragFunctions[id]
    }
    if (isUndefined(this.dragFunctions[id])) {
      let funcBody = function (ev) {
        if (ev.type === 'touchstart') {
          if (vnode.context.statusProps.selected === false) {
            // keep event and put it back to select to catch event
            // console.log('touch on unselected item, fall back to select')
            return
          }
          if (ev.touches.length === 1) {
            // console.log('define touchstart function')
            let app = document.getElementById('application')
            app.style.touchAction = 'none'
            app.setAttribute('touch-action', 'none')

            dragManager.onDragStart(id, ev, this)
            ev.preventDefault()       // forbidden browser behaviours, like swipe down refresh
            ev.stopPropagation()
          } else {
            let app = document.getElementById('application')
            app.style.touchAction = 'auto'
            app.setAttribute('touch-action', 'auto')
            dragManager.removeElementListeners(id, this, ['touchstart'])
            dragManager.removeDocumentListeners(id, ['touchend', 'touchmove'])
          }
        } else {
          dragManager.onDragStart(id, ev, this)
          ev.stopPropagation()
        }
      }
      el.addEventListener('dragstart', funcBody)
      el.addEventListener('touchstart', funcBody, {passive: false, cancelable: true})
      this.dragFunctions[id] = {$el: el, startBody: funcBody}
    }
    let dragDelegate = this.dragFunctions[id]
    initDrag(vnode, dragDelegate)
  }
  finishDrop () {
    this.dropped = true
  }
  removeDocumentListeners (vnode, eventTypes) {
    // console.log('remove document listeners', vnode, eventTypes)
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
    // console.log('remove element listeners', vnode, eventTypes)
    let id = ''
    if (typeof vnode === 'string') {
      id = vnode
    } else {
      id = getItemId(vnode)
    }
    eventTypes.map(et => {
      try {
        el.removeEventListener(et, this.dragFunctions[id][et])
        delete this.dragFunctions[id][et]
      } catch (e) {
      }
    })
  }
  removeDragFunction (vnode) {
    let id = ''
    if (typeof vnode === 'string') {
      id = vnode
    } else {
      id = getItemId(vnode)
    }
    delete this.dragFunctions[id]
  }
}

dragManager = DragManager.getInstance()
window.dragManager = dragManager
export default DragManager

function initDrag (vnode, delegate) {
  let dragStart = function (ev) {
    let id = vnode.context.dataProps.id

    dragManager.init()
    let $this = this
    let moved = false
    let targetLeft = this.style.left
    let targetTop = this.style.top

    let clientX = ev.clientX || ev.touches[0].clientX
    let clientY = ev.clientY || ev.touches[0].clientY

    let rect = this.getBoundingClientRect()

    let offsetX = clientX - rect.left
    let offsetY = clientY - rect.top
    let diffX = 0
    let diffY = 0
    let placeholder = null

    // console.log('targetLeft, targetTop', targetLeft, targetTop, rect)
    // console.log('clientX, clientY', clientX, clientY)

    selectMgr.selectElement(vnode)

    if (ev.type === 'dragstart') {
      ev.dataTransfer.effectAllowed = 'copy'
      if (navigator.userAgent.search('Firefox') >= 0) {
        ev.dataTransfer.setData('application/x-moz-node', vnode.context.dataProps.text)
      } else {
        ev.dataTransfer.setData('text/plain', vnode.context.dataProps.text)
      }
    } else if (ev.type === 'touchstart' && vnode.context.statusProps.selected === true) {
      placeholder = document.createElement('div')
      placeholder.style.position = 'fixed'
      placeholder.style.display = 'block'
      placeholder.style.width = rect.width + 'px'
      placeholder.style.height = rect.height + 'px'
      placeholder.style.left = rect.left + 'px'
      placeholder.style.top = rect.top + 'px'
      placeholder.style.boxSizing = 'border-box'
      placeholder.style.border = '1px solid black'
      placeholder.style.zIndex = 51
      placeholder.style.backgroundColor = vnode.context.$store.getters.getItemById(id).bg_color
      document.getElementById('application').appendChild(placeholder)
      // console.log('insert ph', vnode.context.$store.getters.getItemById(id).bg_color)
    }

    let MouseMove = function (event) {
      // console.log('mousemove', event)
      if (moved === false) {
        moved = true
      }
      if (!(event.screenX === 0 && event.screenY === 0)) {
        let $app = document.getElementById('application')
        let currentClientX = event.clientX || event.touches[0].clientX
        let currentClientY = event.clientY || event.touches[0].clientY

        targetLeft = parseInt(($app.scrollLeft + currentClientX - offsetX - 10) / store.getters.scale)
        targetTop = parseInt(($app.scrollTop + currentClientY - offsetY - 10) / store.getters.scale)
      }
    }

    let MouseUp = function (event) {
      // console.log('mouseup')
      if (dragManager.dropped === false && moved === true) {
        // console.log('mouseup?', selectMgr.selected[0].context.dataProps.id, targetTop, targetLeft)
        selectMgr.selected[0].context.$store.commit('moveItem',
          {
            id: selectMgr.selected[0].context.dataProps.id,
            top: parseInt(targetTop),
            left: parseInt(targetLeft),
            stack: 'board'
          })

        selectMgr.unselectAll()
        dragManager.dropped = true

        dragManager.removeDocumentListeners(id, ['drag', 'dragend'])
        if (navigator.userAgent.search('Firefox') >= 0) {
          dragManager.removeDocumentListeners(id, ['dragover'])
        }
      }
    }

    let TouchMove = function (event) {
      event.preventDefault()
      if (moved === false) {
        moved = true
      }
      if (!(event.screenX === 0 && event.screenY === 0)) {
        let $app = document.getElementById('application')
        let currentClientX = event.touches[0].clientX
        let currentClientY = event.touches[0].clientY
        diffX = currentClientX - clientX
        diffY = currentClientY - clientY

        if (vnode.context.statusProps.selected === true) {
          if (Math.abs(diffX) + Math.abs(diffY) > 100) {
            placeholder.style.left = currentClientX - offsetX + 'px'
            placeholder.style.top = currentClientY - offsetY + 'px'
          } else {
            placeholder.style.left = clientX - offsetX + 'px'
            placeholder.style.top = clientY - offsetY + 'px'
          }
        }

        targetLeft = parseInt(($app.scrollLeft + currentClientX - offsetX - 10) / store.getters.scale)
        targetTop = parseInt(($app.scrollTop + currentClientY - offsetY - 10) / store.getters.scale)
      }
    }

    let TouchEnd = function (ev) {
      // console.log('touchEnd', id)
      let app = document.getElementById('application')
      app.style.touchAction = 'auto'
      app.setAttribute('touch-action', 'auto')
      app.removeChild(placeholder)
      if (dragManager.dropped === false && moved === true) {
        // console.log('diff', Math.abs(diffX) + Math.abs(diffY))
        if (Math.abs(diffX) + Math.abs(diffY) > 100) {
          selectMgr.selected[0].context.$store.commit('moveItem',
            {
              id: selectMgr.selected[0].context.dataProps.id,
              top: parseInt(targetTop),
              left: parseInt(targetLeft),
              stack: 'board'
            })
          selectMgr.unselectAll()
          dragManager.dropped = true
        } else {
        }
        // console.log('touch UP?', selectMgr.selected[0].context.dataProps.id, targetTop, targetLeft)

        if (navigator.userAgent.search('Firefox') >= 0) {
          dragManager.removeDocumentListeners(id, ['dragover'])
        }
        dragManager.removeElementListeners(id, $this, ['touchstart'])
        dragManager.removeDocumentListeners(id, ['touchend', 'touchmove', 'touchcancel'])
      }

      if (dragManager.dropped === false && moved === false) {
        // console.log('touchend')
        dragManager.removeElementListeners(id, $this, ['touchstart'])
        dragManager.removeDocumentListeners(id, ['touchend', 'touchmove', 'touchcancel'])
      }
    }

    let TouchCancel = function (ev) {
      // console.log('touchEnd')
      let app = document.getElementById('application')
      app.style.touchAction = 'auto'
      app.setAttribute('touch-action', 'auto')
      app.removeChild(placeholder)
      if (dragManager.dropped === false && moved === true) {
        // console.log('diff', Math.abs(diffX) + Math.abs(diffY))
        if (Math.abs(diffX) + Math.abs(diffY) > 100) {
          selectMgr.selected[0].context.$store.commit('moveItem',
            {
              id: selectMgr.selected[0].context.dataProps.id,
              top: parseInt(targetTop),
              left: parseInt(targetLeft),
              stack: 'board'
            })
          selectMgr.unselectAll()
          dragManager.dropped = true
        } else {
          // selectMgr.fobiddenSelectOnce = true
          // dragManager.dropped = false
        }
        // console.log('touch UP?', selectMgr.selected[0].context.dataProps.id, targetTop, targetLeft)

        if (navigator.userAgent.search('Firefox') >= 0) {
          dragManager.removeDocumentListeners(id, ['dragover'])
        }
        dragManager.removeElementListeners(id, $this, ['touchstart'])
        dragManager.removeDocumentListeners(id, ['touchend', 'touchmove'])
      }

      if (dragManager.dropped === false && moved === false) {
        // console.log('touchend')
        dragManager.removeElementListeners(id, $this, ['touchstart'])
        dragManager.removeDocumentListeners(id, ['touchend', 'touchmove'])
        // selectMgr.unselectAll()
        selectMgr.fobiddenSelectOnce = true
        dragManager.dropped = false
      }
    }

    delegate.drag = MouseMove
    delegate.dragend = MouseUp
    delegate.touchmove = TouchMove
    delegate.touchend = TouchEnd
    delegate.touchcancel = TouchCancel

    if (navigator.userAgent.search('Firefox') >= 0) {
      delegate.dragover = MouseMove
      document.addEventListener('dragover', MouseMove)
    }
    // console.log('onstart: ', ev.type)
    if (ev.type === 'dragstart') {
      document.addEventListener('drag', delegate.drag)
      document.addEventListener('dragend', delegate.dragend)
    } else if (ev.type === 'touchstart') {
      document.addEventListener('touchmove', delegate.touchmove, {passive: false, cancelable: true})
      document.addEventListener('touchend', delegate.touchend)
      document.addEventListener('touchcancel', delegate.touchcancel)
    }
  }
  delegate.dragstart = dragStart
}

Vue.directive('draggable', {
  bind: function (el, binding, vnode) {
    // console.log('drag binding')
    el.setAttribute('draggable', '' + binding.value)
    if (binding.value === true) {
      dragManager.bindDrag(el, vnode)
    } else {
      // console.log('draggable dont initiate', binding.value)
    }
  },
  update: function (el, binding, vnode, oldVnode) {
    if (binding.value === binding.oldValue) {
      return
    }
    el.setAttribute('draggable', '' + binding.value)
    if (binding.value === true) {
      dragManager.bindDrag(el, vnode)
    } else {
      dragManager.removeElementListeners(vnode, el, ['touchstart'])
      // console.log('updated draggable with ', binding.value, vnode.context.dataProps.id)
    }
  },
  unbind: function (el, binding, vnode) {
    // console.log('unbind drag')
    if (!vnode.context.$store.getters.hasId(getItemId(vnode))) {
      dragManager.removeDragFunction(vnode)
    }
  }
})
