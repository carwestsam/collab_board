<template>
  <div
    v-bind:style="{
      left: styleObject.left || 'none',
      top: styleObject.top || 'none',
      width: styleObject.width,
      height: styleObject.height,
      display: styleObject.display,
      position: styleObject.position,
      fontSize: styleObject.fontSize,
      float: styleObject.float
    }"
    v-bind:class="{select: statusProps.selected, resizable: styleProps.styleOffset}"
    v-selectable="statusProps.selected"
    class="sticker">
    <!-- Work {{dataProps.id.substring(0,6)}} -->
    <div class="absolute-poistion" v-bind:style="{
        width: styleObject.width,
        height: styleObject.height,
        backgroundColor: styleObject.backgroundColor
      }">
    <div v-draggable="statusProps.draggable" class="sticker-inner">
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
    </div>
    <div v-if="!statusProps.selected && this.$store.getters.displayLike" class="like-display">
      <div>
        <v-icon large color="pink" v-bind:style="{fontSize:'1.4em'}">thumb_up</v-icon>
        <span>{{$store.getters.likes(dataProps.id)}}</span>
      </div>
    </div>
    <div class="toolbar-wrapper">
      <v-toolbar
        v-if="this.statusProps.selected && !this.statusProps.editing"
        color="white"
        floating
        class="sticker-options"
        dense
        >
          <v-btn :color='dataProps.like ? "pink" : "grey"' flat icon @mouseup.prevent="toggleLike">
            <v-icon>thumb_up</v-icon>
          </v-btn>
          <v-btn color="primary" flat icon @mousedown.prevent="intoEdit">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn color="primary" flat icon @mousedown.prevent="deleteSticker">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-toolbar>
    </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import constants from '../../../shared_components/constants.mjs'

export default {
  name: 'sticker',
  props: ['sticker', 'scale'],
  data () {
    return {
      styleProps: {
        // width: 120,
        // height: 120,
        width: (this.sticker.width || 120),
        height: (this.sticker.height || 120),
        left: this.sticker.left || 100,
        top: this.sticker.top || 100,
        bg_color: this.sticker.bg_color || 'yellow',
        styleOffset: typeof this.sticker.styleOffset === 'undefined' ? true : this.sticker.styleOffset,
        fontSize: constants.default_font_size + 'px'
      },
      statusProps: {
        selected: false,
        draggable: true,
        editing: false,
        resizable: false
      },
      dataProps: {
        id: this.sticker.id,
        text: this.sticker.text,
        like: this.$store.getters.like(this.sticker.id)
      }
    }
  },
  computed: {
    styleObject: function () {
      let style = {
        width: this.styleProps.width / constants.default_font_size + 'em',
        height: this.styleProps.height / constants.default_font_size + 'em',
        left: this.styleProps.left / constants.default_font_size + 'em',
        top: this.styleProps.top / constants.default_font_size + 'em',
        fontSize: constants.default_font_size * (this.scale || this.$store.getters.scale) + 'px',
        backgroundColor: this.styleProps.bg_color
      }
      if (this.styleProps.styleOffset === false) {
        style.display = 'inline-block'
        style.position = 'relative'
        style.float = 'left'
        delete style.left
        delete style.top
      } else {
        style.position = 'absolute'
      }
      if (this.sticker.styleRemoveSize === true) {
        style.width = '120px'
        style.height = '120px'
      }
      return style
    },
    inputOverlayStyleObject: function () {
      return {
        display: this.statusProps.editing === true ? 'block' : 'none',
        width: this.styleProps.width / constants.default_font_size + 'em',
        height: this.styleProps.height / constants.default_font_size + 'em'
        // left: this.styleProps.left + 'px',
        // top: this.styleProps.top + 'px'
      }
    }
  },
  methods: {
    select: function () {
      this.statusProps.selected = true
      this.statusProps.draggable = true
      this.statusProps.resizable = true
    },
    unselect: function () {
      this.statusProps.selected = false
      this.statusProps.draggable = false
      this.statusProps.resizable = false
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
    },
    onResizing: function (width, height) {
      if (this.statusProps.selected) {
        this.styleProps.width = width
        this.styleProps.height = height
      }
    },
    onResizeStop: function (width, height) {
      if (this.statusProps.selected) {
        this.styleProps.width = width
        this.styleProps.height = height
        this.$store.commit('resizeItem', {id: this.dataProps.id, width, height})
      }
    },
    toggleLike: function () {
      this.$store.commit('likeItem', {itemId: this.dataProps.id, userId: this.$store.getters.userId, like: !this.dataProps.like})
    }
  }
}
</script>
<style lang="scss" scoped>
.sticker {
  position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.2em;
  text-align: left;
  &.select {
    box-shadow: 0px 0px 10px blue;
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
.toolbar-wrapper {
  position: relative;
  left: 0;
  bottom: -5px;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sticker-options {
  display: inline-block;
  margin: 0;
  right: 0;
  bottom: 0px;
  z-index: 50;
}
.input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 18px;
  line-height: 1.2em;
  // text-align: center;
  z-index: 100;
  padding: 0.35em;
  resize: none;
  background-color: white;
}
.like-display {
  position: absolute;
  right: 0;
  bottom: .3em;
  background-color: white;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  padding: .2em 1em;
  font-weight: 600;
  line-height: 2em;
}
.absolute-poistion {
  position: absolute;
}
</style>
