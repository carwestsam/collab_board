import Vue from 'vue'

Vue.directive('cs-click', {
  bind: function (el, binding, vnode) {
    if (typeof binding.value !== 'function') {
      console.error('should bind cs-click with handler function')
    }
    el.addEventListener('mousedown', function (ev) {
      binding.value()
      ev.preventDefault()
    })
    el.addEventListener('touchstart', function (ev) {
      binding.value()
    })
  }
})
