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
    this.unselectAll()
    this.selected.push(vnode)
    if (typeof vnode.context.select === 'function') {
      vnode.context.select()
    }
  }
  unselectAll () {
    for (let idx = 0; idx < this.selected.length; idx++) {
      if (typeof this.selected[idx].context.unselect === 'function') {
        this.selected[idx].context.unselect()
      }
    }
    this.selected = []
  }
}

let selectMgr = new SelectMgr()

Vue.directive('selectable', {
  bind: function (el, binding, vnode) {
    el.addEventListener('click', function hoho (event) {
      if (typeof vnode.context.statusProps === 'undefined') {
        selectMgr.unselectAll()
        return
      }
      if (
          typeof vnode.context.statusProps === 'undefined' ||
          typeof vnode.context.statusProps.selected === 'undefined' ||
          typeof vnode.context.select !== 'function' ||
          typeof vnode.context.unselect !== 'function'
        ) {
        console.error('selectable: missing required fields')
        // return
      }
      if (vnode.context.statusProps.selected === true) {
        if (typeof vnode.context.unselect === 'function') {
          vnode.context.unselect()
        }
      } else if (vnode.context.statusProps.selected === false) {
        selectMgr.selectElement(vnode)
      }
      event.stopPropagation()
    })
  }
})

export default SelectMgr
