<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected}"
    v-draggable="statusProps.draggable"
    class="group"
    v-selectable v-dropable>
    <div class="group-inner">
      Group
    </div>  
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'group',
  props: ['group'],
  data () {
    return {
      styleProps: {
        width: 500,
        height: 500,
        left: this.group.left || 500,
        top: this.group.top || 500,
        bg_color: this.group.bg_color || 'yellow',
        styleOffset: typeof this.group.styleOffset === 'undefined' ? true : this.group.styleOffset
      },
      statusProps: {
        selected: false,
        draggable: true,
        editing: false
      },
      dataProps: {
        id: this.group.id,
        text: this.group.text
      }
    }
  },
  computed: {
    styleObject: function () {
      let style = {
        width: this.styleProps.width + 'px',
        height: this.styleProps.height + 'px',
        left: this.styleProps.left + 'px',
        top: this.styleProps.top + 'px',
        'background-color': this.styleProps.bg_color
      }
      if (this.styleProps.styleOffset === false) {
        style.display = 'inline-block'
        style.postion = 'relative'
        style.float = 'left'
        style['z-index'] = '1001'
        delete style.left
        delete style.top
      } else {
        style.position = 'absolute'
      }
      return style
    }
  },
  methods: {
    select: function () {
      console.log('group select')
      this.statusProps.selected = true
      this.statusProps.draggable = true
    },
    unselect: function () {
      this.statusProps.selected = false
      this.statusProps.draggable = false
    },
    intoEdit: function () {
      this.statusProps.editing = true
      // let self = this
      Vue.nextTick(() => {
        this.$refs.textInput.focus()
      })
    },
    outsideEdit: function () {
      this.statusProps.editing = false
      this.$store.commit('updateStickerText', {id: this.dataProps.id, text: this.dataProps.text})
    },
    delete: function () {
      let confirmDelete = confirm('Do you want to delete Group: \n' + this.dataProps.text + '\n')
      if (confirmDelete) {
        this.$store.commit('deleteItem', {id: this.dataProps.id})
      }
    }
  }
}
</script>

<style lang="scss">
.group {
  // position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  font-size: 32px;
  text-align: left;
  font-weight: bold;
  line-height: 1.2em;
  &.select {
    box-shadow: 0px 0px 10px blue;
    z-index: 100;
  }
  .group-inner {
    width: 100%;
    height: 100%;
    position: relative;
    .content {
      width: 100%;
      overflow: scroll;
    }
  }
}
</style>
