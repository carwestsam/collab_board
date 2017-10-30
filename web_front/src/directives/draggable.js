import Vue from 'vue'
import selectMgr from './selectable'
import _ from 'lodash'

let dragManager = null
class DragManager {
  constructor () {
    this.dropped = false
  }
  static getInstance () {
    if (dragManager === null) {
      dragManager = new DragManager()
    }
    return dragManager
  }
  dragstart (ev, item) {
    console.log('dragstart', ev, item)
    console.log(ev)
    ev.dataTransfer.setData('text/plain', JSON.stringify(item))
  }
  initDrag () {
    this.dropped = false
  }
  finishDrop () {
    this.dropped = true
  }
}

dragManager = new DragManager()

document.addEventListener('scroll', function (e) {
  console.log(e)
  debugger
})

function initDrag (vnode) {
  let MouseDown = function (event) {
    console.log('dragstart', event.offsetX, event.offsetY)
    dragManager.initDrag()
    let moved = false
    let targetLeft = this.style.left
    let targetTop = this.style.top
    // debugger
    let offsetX = event.offsetX
    let offsetY = event.offsetY

    event.dataTransfer.effectAllowed = 'copy'
    console.log(selectMgr.selected)
    event.dataTransfer.setData('text', 'b')

    let MouseMove = function (event) {
      if (moved === false) {
        moved = true
      }
      // dup.style.left = (event.screenX - sx + ol) + 'px'
      // dup.style.top = (event.screenY - sy + ot) + 'px'
      if (!(event.screenX === 0 && event.screenY === 0)) {
        let $app = document.getElementById('app')
        targetLeft = $app.scrollLeft + event.clientX - offsetX - 10 + 'px'
        targetTop = $app.scrollTop + event.clientY - offsetY - 10 + 'px'
        // console.log('mousemove', targetLeft, targetTop)
      }
      // event.preventDefault()
    }
    let MouseUp = function (event) {
      console.log('draggable: mouseUp', event)
      // console.log(parseInt(dup.style.top), parseInt(dup.style.left))
      if (dragManager.dropped === false && moved === true) {
        vnode.context.$store.commit('moveStickerToBoard',
          {
            id: vnode.context.dataProps.id,
            top: parseInt(targetTop),
            left: parseInt(targetLeft)
          })
      }
      // vnode.context.select()
      // $this.removeEventListener('mousedown', MouseDown)
      document.removeEventListener('drag', MouseMove)
      document.removeEventListener('dragend', MouseUp)
    }

    document.addEventListener('drag', MouseMove)
    document.addEventListener('dragend', MouseUp)
  }
  return MouseDown
}

Vue.directive('draggable', {
  bind: function (el, binding, vnode) {
    el.setAttribute('draggable', '' + binding.value)
    vnode.context.cb_draggable_inited = false
    if (binding.value === true) {
      el.addEventListener('dragstart', initDrag(vnode))
      vnode.context.cb_draggable_inited = true
    }
    // el.addEventListener('click', () => console.log('click'))
    // console.log('context', vnode.context)
  },
  update: function (el, binding, vnode) {
    el.setAttribute('draggable', '' + binding.value)
    if (binding.value === true && vnode.context.cb_draggable_inited === false) {
      el.addEventListener('dragstart', initDrag(vnode))
      el.addEventListener('mousedown', function (e) {
        console.log('mosedown, ', e.offsetX, e.offsetY)
      })
      vnode.context.cb_draggable_inited = true
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
        console.log('on callback')
        dragManager.finishDrop()
        binding.value.apply(this, arguments)
      }
    }

    let handleOverFunction = function () {
      console.log('dragover')
      // event.preventDefault()
    }
    let handleOver = _.throttle(handleOverFunction, 1000)

    el.addEventListener('dragover', function (event) {
      // console.log('dragover')
      handleOver()
      event.preventDefault()
    })
    el.addEventListener('dragenter', function () {
      console.log('enter')
      el.classList.add('dragover')
    })
    el.addEventListener('dragleave', function () {
      console.log('leave')
      el.classList.remove('dragover')
    })
    el.addEventListener('drop', function (event) {
      el.classList.remove('dragover')
      let e = event
      console.log('drop', event.dataTransfer.getData('text/plain'), event)
      callbackFunc.apply(this, [e])
      e.preventDefault()
    })
  }
})
