<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected}"
    v-draggable="statusProps.draggable"
    v-selectable="statusProps.selected"
    class="sticker">
    <!-- Work {{dataProps.id.substring(0,6)}} -->
    <div class="sticker-inner">
      <div class="content">
      {{dataProps.text}}
      </div>
      <textarea
        ref="textInput"
        v-bind:style="inputOverlayStyleObject"
        v-on:blur="outsideEdit"
        @keydown.enter="outsideEdit"
        v-model="dataProps.text"
        class="input-overlay"/>
      <span class="option-btns" v-if="this.statusProps.selected && !this.statusProps.editing">
        <v-btn color="primary" fab small dark @mousedown.prevent="intoEdit">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn color="primary" fab small dark @mousedown.prevent="deleteSticker">
          <v-icon>delete</v-icon>
        </v-btn>
      </span>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'sticker',
  props: ['sticker'],
  data () {
    return {
      styleProps: {
        width: 120,
        height: 120,
        left: this.sticker.left || 100,
        top: this.sticker.top || 100,
        bg_color: this.sticker.bg_color || 'yellow',
        styleOffset: typeof this.sticker.styleOffset === 'undefined' ? true : this.sticker.styleOffset
      },
      statusProps: {
        selected: false,
        draggable: true,
        editing: false
      },
      dataProps: {
        id: this.sticker.id,
        text: this.sticker.text
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
        // style['z-index'] = '1001'
        delete style.left
        delete style.top
      } else {
        style.position = 'absolute'
      }
      return style
    },
    inputOverlayStyleObject: function () {
      return {
        display: this.statusProps.editing === true ? 'block' : 'none',
        width: this.styleProps.width + 'px',
        height: this.styleProps.height + 'px'
        // left: this.styleProps.left + 'px',
        // top: this.styleProps.top + 'px'
      }
    }
  },
  methods: {
    select: function () {
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
      if (this.statusProps.editing === true) {
        this.statusProps.editing = false
        this.$store.commit('updateStickerText', {id: this.dataProps.id, text: this.dataProps.text})
      }
    },
    deleteSticker: function () {
      let confirmDelete = confirm('Do you want to delete Sticker: \n' + this.dataProps.text + '\n')
      if (confirmDelete) {
        this.$store.commit('deleteItem', {id: this.dataProps.id})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sticker {
  // position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2em;
  text-align: left;
  &.select {
    box-shadow: 0px 0px 2px blue;
    z-index: 20;
  }
  .content {
    padding: 5px;
  }
  .sticker-inner {
    width: 100%;
    height: 100%;
    position: relative;
    .content {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
.option-btns {
  position: absolute;
  right: 0;
  bottom: 0;
}
.input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 18px;
  line-height: 1.2em;
  // text-align: center;
  z-index: 100;
  padding: 5px;
  resize: none;
  background-color: white;
}
</style>
