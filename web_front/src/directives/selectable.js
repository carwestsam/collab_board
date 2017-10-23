import Vue from 'vue'

class SelectMgr {
  constructor () {
    this.selected = []
  }
  static getInstance () {
    if (selectMgr === null) {
      selectMgr = new SelectMgr()
    }
    return selectMgr
  }
  selectElement (vnode) {
    for (let idx = 0; idx < this.selected.length; idx++) {
      this.selected[idx].context.unselect()
    }
    this.selected.push(vnode)
    vnode.context.select()
  }
}

let selectMgr = new SelectMgr()

Vue.directive('selectable', {
  bind: function (el, binding, vnode) {
    el.addEventListener('mouseup', function hoho () {
      if (typeof vnode.context.statusProps.selected === 'undefined' ||
          typeof vnode.context.select !== 'function' ||
          typeof vnode.context.unselect !== 'function'
        ) {
        console.error('selectable: missing required fields')
        return
      }
      if (vnode.context.statusProps.selected === true) {
        console.log('unselect')
        vnode.context.unselect()
      } else {
        console.log('select')
        selectMgr.selectElement(vnode)
      }
      console.log('yes')
    })
  }
})
