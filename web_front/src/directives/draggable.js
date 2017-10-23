import Vue from 'vue'
// import placeHolder from '../components/PlaceHolder'
// const PlaceHolderCtrl = Vue.extend(placeHolder)

let dragManager = null
class DragManager {
  constructor () {
    this.onHand = false
    this.item = null
  }
  static getInstance () {
    if (dragManager === null) {
      dragManager = new DragManager()
    }
    return dragManager
  }
  dragstart (ev, item) {
    console.log('dragstart', ev, item)
    // const stickerInstance = new StickerCtol({propsData: {sticker: item}})
    // let domElement = document.createElement('div')
    // domElement.setAttribute('id', 'dragElement')
    // stickerInstance.$mount('#dragElement')
    console.log(ev)
    // debugger
    ev.dataTransfer.setData('text/plain', JSON.stringify(item))
    // ev.dataTransfer.setDragImage(null, 0, 0)
    // ev.dataTransfer.
    // console.log(sticker)
  }
}

dragManager = new DragManager()

function initDrag (vnode) {
  let MouseDown = function (event) {
    console.log('mousedown')
    let $this = this
    let app = document.getElementById('app')
    let dup = this.cloneNode(true)

    let sx = event.screenX
    let sy = event.screenY
    let ot = parseInt(dup.style.top)
    let ol = parseInt(dup.style.left)
    let moved = false

    // console.log(event.screenX, event.screenY)
    let MouseMove = function (event) {
      app.appendChild(dup)
      dup.style.left = (event.screenX - sx + ol) + 'px'
      dup.style.top = (event.screenY - sy + ot) + 'px'
      // console.log('mousemove', dup.style.left, dup.style.top, event.screenX, event.screenY, sx, sy, ot, ol)
      event.preventDefault()
      moved = true
    }
    let MouseUp = function (event) {
      console.log('draggable: mouseUp')
      // console.log(parseInt(dup.style.top), parseInt(dup.style.left))
      if (moved === true) {
        dup.parentNode.removeChild(dup)
        vnode.context.$store.commit('moveSticker',
          {
            id: vnode.context.dataProps.id,
            top: parseInt(dup.style.top),
            left: parseInt(dup.style.left)
          })
      }
      // vnode.context.select()
      $this.removeEventListener('mousedown', MouseDown)
      document.removeEventListener('mousemove', MouseMove)
      document.removeEventListener('mouseup', MouseUp)
    }
    // const holderInstance = new PlaceHolderCtrl({propsData: {visibleBlock: {width: 20, height: 20, bgColor: 'blue'}}})
    // app.appendChild(holderInstance)
    // var dup = document.createElement('div')

    // event.dataTransfer.setData('text', JSON.stringify(sticker))

    // debugger
    document.addEventListener('mousemove', MouseMove)
    document.addEventListener('mouseup', MouseUp)
  }
  return MouseDown
}

Vue.directive('draggable', {
  bind: function (el, binding, vnode) {
    // var s = JSON.stringify
    // el.innerHTML =
    //   'name: ' + s(binding.name) + '<br>' +
    //   'value: ' + s(binding.value) + '<br>' +
    //   'expression: ' + s(binding.expression) + '<br>' +
    //   'argument: ' + s(binding.arg) + '<br>' +
    //   'modifiers: ' + s(binding.modifiers) + '<br>' +
    //   'vnode keys: ' + Object.keys(vnode).join(', ')
    // console.log(binding.value, binding.oldValue)
    // el.setAttribute('draggable', binding.value)
    // let targetId = vnode.context.dataProps.id
    // let sticker = vnode.context.$store.getters.getStickerById(targetId)
    // el.addEventListener('dragstart', function (event) { dragManager.dragstart(event, sticker) })
    if (binding.value === true) {
      el.addEventListener('mousedown', initDrag(vnode))
    }
    // el.addEventListener('click', () => console.log('click'))
    // console.log('context', vnode.context)
  },
  update: function (el, binding, vnode) {
    // el.setAttribute('draggable', binding.value)
    let targetId = vnode.context.dataProps.id
    // console.log(vnode, vnode.context, vnode.context.$store, vnode.context.$store.getters)
    let sticker = vnode.context.$store.getters.getStickerById(targetId)
    if (binding.value === true) {
      el.addEventListener('mousedown', initDrag(vnode))
    }
    return sticker
  }
})
