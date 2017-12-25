import Vue from 'vue'
import _ from 'lodash'

// Vue.component('resizable-handle', {
//   template: '<div>x</div>'
// })

let cons = Vue.extend({
  template: `<div
    class="resizable-handle"
    @mousedown.stop="onResize">
  </div>`,
  methods: {
    onResize: function (event) {
      let pe = this.$parentElement
      let pn = this.$parent
      let originDraggable = pe.getAttribute('draggable')

      // console.log('started', event)
      let initWidth = parseInt(pe.style.width)
      let initHeight = parseInt(pe.style.height)
      let initClientX = event.clientX
      let initClientY = event.clientY

      // debugger

      pe.setAttribute('draggable', 'false')
      let onmousemove = function (ev) {
        let deltaX = ev.clientX - initClientX
        let deltaY = ev.clientY - initClientY
        // console.log('mouseup', deltaX, deltaY, initWidth + deltaX, initHeight + deltaY)
        // debugger
        if (_.hasIn(pn, 'context.onResizing')) {
          pn.context.onResizing(initWidth + deltaX, initHeight + deltaY)
        }
      }
      let onmouseup = function (ev) {
        // console.log('mouseup')
        let deltaX = ev.clientX - initClientX
        let deltaY = ev.clientY - initClientY
        // console.log('mouseup', deltaX, deltaY, initWidth + deltaX, initHeight + deltaY)
        if (_.hasIn(pn, 'context.onResizeStop')) {
          pn.context.onResizeStop(initWidth + deltaX, initHeight + deltaY)
        }

        pe.setAttribute('draggable', originDraggable)
        document.removeEventListener('mousemove', onmousemove)
        document.removeEventListener('mouseup', onmouseup)
      }
      document.addEventListener('mousemove', onmousemove)
      document.addEventListener('mouseup', onmouseup)
    }
  }
})

let Comp = Vue.component('resizeable-handle', cons)

Vue.directive('resizable', {
  bind: function (el, binding, vnode) {
    let node = document.createElement('div')
    let xnode = new Comp().$mount(node)
    xnode.$parent = vnode
    xnode.$parentElement = el
    el.appendChild(xnode.$el)
  }
})
