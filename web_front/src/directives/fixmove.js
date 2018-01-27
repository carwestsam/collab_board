import Vue from 'vue'
import calcUtils from '../utils/calcUtils.js'

let limitRange = calcUtils().limitRange

Vue.directive('fix-move', {
  bind: function (el, binding, vnode) {
    // console.log('binding fix-move:', binding.value, el, vnode)
    let MoveStart = function (moveEventType, endEventType) {
      return function (ev) {
        // console.log('touch start')
        ev.preventDefault()
        ev.stopPropagation()
        let initClientX = ev.clientX || ev.touches[0].clientX
        let initClientY = ev.clientY || ev.touches[0].clientY
        let initLeft = vnode.context.styleProps.left
        let initBottom = vnode.context.styleProps.bottom
        let diffX = 0
        let diffY = 0
        let initRect = this.getBoundingClientRect()
        let minimumLeft = 0
        let maximumLeft = window.innerWidth - initRect.width
        let minimumBottom = 0
        let maximumBottom = window.innerHeight - initRect.height
        // console.log('start', initRect, maximumLeft, maximumBottom)

        let TouchMove = function (ev) {
          let currentClientX = ev.clientX || ev.touches[0].clientX
          let currentClientY = ev.clientY || ev.touches[0].clientY
          diffX = currentClientX - initClientX
          diffY = currentClientY - initClientY
          // console.log(initLeft + diffX, initBottom - diffY)
          vnode.context.styleProps.left = limitRange(initLeft + diffX, minimumLeft, maximumLeft)
          vnode.context.styleProps.bottom = limitRange(initBottom - diffY, minimumBottom, maximumBottom)
        }

        let TouchEnd = function (ev) {
          document.removeEventListener(moveEventType, TouchMove)
          document.removeEventListener(endEventType, TouchEnd)
        }

        document.addEventListener(moveEventType, TouchMove, {passive: false, cancelable: true})
        document.addEventListener(endEventType, TouchEnd)
      }
    }
    let mousedown = MoveStart('mousemove', 'mouseup')
    let touchstart = MoveStart('touchmove', 'touchend')
    el.addEventListener('touchstart', touchstart, {passive: false})
    el.addEventListener('mousedown', mousedown, {passive: false})
  }
})
