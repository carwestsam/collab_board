import Vue from 'vue'
import selectMgr from './selectable'
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
document.addEventListener('mousemove', function (event) {
  let $app = document.getElementById('app')
  console.log('x,y,cx,cy,ox,oy:', event.clientX, event.clientY, $app.scrollLeft, $app.scrollTop, event.offsetX, event.offsetY)
  // console.log($app)
  // debugger
})

function initDrag (vnode) {
  let MouseDown = function (event) {
    console.log('dragstart')
    // let $this = this
    // let app = document.getElementById('app')
    // let dup = this.cloneNode(true)

    let $app = document.getElementById('app')
    // let sx = event.screenX
    // let sy = event.screenY
    // let ot = parseInt(this.style.top)
    // let ol = parseInt(this.style.left)
    let moved = false
    let targetLeft = this.style.left
    let targetTop = this.style.top
    // debugger
    let offsetX = event.offsetX
    let offsetY = event.offsetY
    console.log(`$app.scrollLeft: ${$app.scrollLeft}`)
    console.log(`$app.scrollTop: ${$app.scrollTop}`)
    console.log(`event.clientX: ${event.clientX}`)
    console.log(`event.clientY: ${event.clientY}`)
    console.log(`offsetX: ${offsetX}`)
    console.log(`offsetY: ${offsetY}`)

    event.dataTransfer.effectAllowed = 'copy'
    console.log(selectMgr.selected)
    event.dataTransfer.setData('text', 'b')

    // console.log(event.screenX, event.screenY)
    let MouseMove = function (event) {
      // console.log('mouseMove', event)
      if (moved === false) {
        // app.appendChild(dup)
        moved = true
      }
      // dup.style.left = (event.screenX - sx + ol) + 'px'
      // dup.style.top = (event.screenY - sy + ot) + 'px'
      if (!(event.screenX === 0 && event.screenY === 0)) {
        let $app = document.getElementById('app')
        targetLeft = $app.scrollLeft + event.clientX - offsetX + 10 + 'px'
        targetTop = $app.scrollTop + event.clientY - offsetY + 10 + 'px'
        console.log('mousemove', targetLeft, targetTop)
      }
      // event.preventDefault()
    }
    let MouseUp = function (event) {
      console.log('draggable: mouseUp', event)
      // console.log(parseInt(dup.style.top), parseInt(dup.style.left))
      if (moved === true) {
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
    // const holderInstance = new PlaceHolderCtrl({propsData: {visibleBlock: {width: 20, height: 20, bgColor: 'blue'}}})
    // app.appendChild(holderInstance)
    // var dup = document.createElement('div')

    // event.dataTransfer.setData('text', JSON.stringify(sticker))

    // debugger
    document.addEventListener('drag', MouseMove)
    document.addEventListener('dragend', MouseUp)
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
      vnode.context.cb_draggable_inited = true
    }
    // el.setAttribute('draggable', binding.value)
    // let targetId = vnode.context.dataProps.id
    // // console.log(vnode, vnode.context, vnode.context.$store, vnode.context.$store.getters)
    // let sticker = vnode.context.$store.getters.getStickerById(targetId)
    // if (binding.value === true) {
    //   el.addEventListener('mousedown', initDrag(vnode))
    // }
    // return sticker
  }
})

Vue.directive('dropable', {
  bind: function (el, binding, vnode) {
    el.addEventListener('dragover', function (event) {
      // console.log('dragover')
      event.preventDefault()
    })
    el.addEventListener('drop', function (event) {
      event.preventDefault()
      console.log('drop', event.dataTransfer.getData('text/plain'))
    })
  }
})
