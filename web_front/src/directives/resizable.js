import Vue from 'vue'
import {store} from '../store/index'
import _ from 'lodash'

let cons = Vue.extend({
  template: `<div
    class="resizable-handle"
    @mousedown.stop="onResize"
    @touchstart.stop.prevent="onTouchResize">
    <v-icon>network_cell</v-icon>
  </div>`,
  methods: {
    onResize: function (event) {
      let pe = this.$parentElement
      let pn = this.$parent
      let originDraggable = pe.getAttribute('draggable')
      pe.setAttribute('draggable', 'false')

      let initWidth = parseInt(pn.context.styleProps.width)
      let initHeight = parseInt(pn.context.styleProps.height)
      let initClientX = event.clientX
      let initClientY = event.clientY

      let scale = (value) => {
        return value / store.getters.scale
      }

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
    },
    onTouchResize: function (event) {
      console.log('touchResize')
      let pn = this.$parent
      let initWidth = parseInt(pn.context.styleProps.width)
      let initHeight = parseInt(pn.context.styleProps.height)
      let initClientX = event.touches[0].clientX
      let initClientY = event.touches[0].clientY
      let deltaX = 0
      let deltaY = 0

      let scale = (value) => {
        return value / store.getters.scale
      }

      let app = document.getElementById('application')
      app.style.touchAction = 'none'
      app.setAttribute('touch-action', 'none')
      event.stopPropagation()
      event.preventDefault()

      let onmousemove = function (ev) {
        deltaX = scale(ev.touches[0].clientX - initClientX)
        deltaY = scale(ev.touches[0].clientY - initClientY)
        if (_.hasIn(pn, 'context.onResizing')) {
          pn.context.onResizing(initWidth + deltaX, initHeight + deltaY)
        }
      }
      let onmouseup = function (ev) {
        // let deltaX = scale(ev.touches[0].clientX - initClientX)
        // let deltaY = scale(ev.toucheds[0].clientY - initClientY)
        if (_.hasIn(pn, 'context.onResizeStop')) {
          pn.context.onResizeStop(initWidth + deltaX, initHeight + deltaY)
        }

        app.style.touchAction = 'auto'
        app.setAttribute('touch-action', 'auto')
        document.removeEventListener('touchmove', onmousemove)
        document.removeEventListener('touchend', onmouseup)
      }
      document.addEventListener('touchmove', onmousemove)
      document.addEventListener('touchend', onmouseup)
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
