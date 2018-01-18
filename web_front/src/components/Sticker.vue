<template>
  <item
    :uuid='this.dataProps.id'
    :itemStyleObject='this.itemStyleObject'
    :itemOptions='this.itemOptions'
    class="sticker">

    <template slot='content'>
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
      </div>
    </template>

    <template slot="toolbar-options">
      <v-btn :color='dataProps.like ? "pink" : "grey"' flat icon @mouseup.prevent="toggleLike">
        <v-icon>thumb_up</v-icon>
      </v-btn>
      <v-btn color="primary" flat icon @mousedown.prevent="intoEdit">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>

  </item>
</template>
<script>
import Vue from 'vue'
import constants from '../../../shared_components/constants.mjs'
import Item from './Item'

export default {
  name: 'sticker',
  props: ['sticker', 'scale', 'styleRemoveSize'],
  data () {
    return {
      styleProps: {
        width: (this.sticker.width || 120),
        height: (this.sticker.height || 120),
        left: this.sticker.left || 100,
        top: this.sticker.top || 100,
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
    itemOptions: function () {
      return {
        displayLike: true,
        enableOffset: this.styleProps.styleOffset,
        enableResize: false,
        ignoreScale: !(this.styleRemoveSize || false)
      }
    },
    itemStyleObject: function () {
      let style = {
        display: 'block',
        position: 'absolute',
        fontSize: constants.default_font_size * (this.scale || this.$store.getters.scale) + 'px',
        float: 'left'
      }
      if (this.styleProps.styleOffset === false) {
        style.display = 'inline-block'
        style.position = 'relative'
        style.float = 'left'
      }
      if (this.styleRemoveSize === true) {
        style.width = '120px'
        style.height = '120px'
      }
      return style
    },
    inputOverlayStyleObject: function () {
      let style = {
        display: this.statusProps.editing === true ? 'block' : 'none',
        width: this.styleProps.width / constants.default_font_size + 'em',
        height: this.styleProps.height / constants.default_font_size + 'em'
      }
      if (this.styleRemoveSize === true) {
        style.width = '120px'
        style.height = '120px'
      }
      return style
    }
  },
  methods: {
    intoEdit: function () {
      this.statusProps.editing = true
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
    toggleLike: function () {
      this.$store.commit('likeItem', {itemId: this.dataProps.id, userId: this.$store.getters.userId, like: !this.dataProps.like})
    }
  },
  components: {
    Item
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
  order:2;
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

.input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 18px;
  line-height: 1.2em;
  width: 120px;
  height: 120px;
  // text-align: center;
  z-index: 100;
  padding: 0.35em;
  resize: none;
  background-color: white;
  box-shadow: 0px 0px 10px blue;
}
</style>
