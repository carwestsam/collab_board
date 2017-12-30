import Vue from 'vue'
import {store} from '../store/index'
import _ from 'lodash'

let cons = Vue.extend({
  template: `<div
    class="resizable-handle"
    @mousedown.stop="onResize">
    <v-icon>network_cell</v-icon>
  </div>`,
  methods: {
    onResize: function (event) {
      let pe = this.$parentElement
      let pn = this.$parent
      let originDraggable = pe.getAttribute('draggable')

      let initWidth = parseInt(pn.context.styleProps.width)
      let initHeight = parseInt(pn.context.styleProps.height)
      let initClientX = event.clientX
      let initClientY = event.clientY

      let scale = (value) => {
        return value / store.getters.scale
      }

      pe.setAttribute('draggable', 'false')
      let onmousemove = function (ev) {
        let deltaX = scale(ev.clientX - initClientX)
        let deltaY = scale(ev.clientY - initClientY)
        if (_.hasIn(pn, 'context.onResizing')) {
          pn.context.onResizing(initWidth + deltaX, initHeight + deltaY)
        }
      }
      let onmouseup = function (ev) {
        let deltaX = scale(ev.clientX - initClientX)
        let deltaY = scale(ev.clientY - initClientY)
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
