<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected, resizable: styleProps.styleOffset}"
    class="group"
    v-selectable
    v-draggable="statusProps.draggable"
    v-dropable="drop"
    v-resizable="statusProps.resizable"
    >
    <div class="group-inner">
      <div
        v-if="!statusProps.editing"
        @dbclick="intoEdit"
        class="group-name">
        {{dataProps.text}}
      </div>
      <input
        ref="textInput"
        type="text"
        v-bind:style="inputTitleStyleObject"
        v-model="dataProps.text"
        v-on:blur="outsideEdit"
        @keydown.enter="outsideEdit"
        class="input-title">
      <div class="content">
        <template v-for="item in items" >
          <sticker v-if="item.type==='sticker'" :key="item.id" :sticker="item"></sticker>
          <group v-if="item.type==='group'" :key="item.id" :group="item"></group>
        </template>
      </div>
      <div class="toolbar-wrapper">
        <v-toolbar
          v-if="this.statusProps.selected && !this.statusProps.editing"
          color="white"
          floating
          class="sticker-options"
          dense
          >
            <v-btn color="pink" flat icon>
              <v-icon>thumb_up</v-icon>
            </v-btn>
            <v-btn color="primary" flat icon @mousedown.prevent="intoEdit">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn color="primary" flat icon @mousedown.prevent="deleteGroup">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-toolbar>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Sticker from './Sticker'
// import selectMgr from '../directives/selectable'
import constants from '../../../shared_components/constants.mjs'

let defaultGroupFontSize = 2 * constants.default_font_size

export default {
  name: 'group',
  props: ['group'],
  data () {
    return {
      styleProps: {
        width: this.group.width || 300,
        height: this.group.height || 300,
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
        width: this.styleProps.width / defaultGroupFontSize + 'em',
        height: this.styleProps.height / defaultGroupFontSize + 'em',
        left: this.styleProps.left / defaultGroupFontSize + 'em',
        top: this.styleProps.top / defaultGroupFontSize + 'em',
        fontSize: defaultGroupFontSize * this.$store.getters.scale + 'px',
        'background-color': this.styleProps.bg_color
      }
      if (this.styleProps.styleOffset === false) {
        style.display = 'inline-block'
        style.postion = 'relative'
        style.float = 'left'
        style.width = '100%'
        style.height = 'auto'
        style.fontSize = '0.8em'
        style.textAlign = 'left'
        delete style.left
        delete style.top
        delete style.height
      } else {
        style.position = 'absolute'
      }
      return style
    },
    items: function () {
      return this.$store.getters.items(this.dataProps.id).map(item => {
        item.styleOffset = false
        return item
      })
    },
    inputTitleStyleObject: function () {
      return {
        display: this.statusProps.editing === true ? 'block' : 'none',
        width: '100%',
        height: '1em'
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
    deleteGroup: function () {
      let confirmDelete = confirm('Do you want to delete Group: \n' + this.dataProps.text + '\n')
      if (confirmDelete) {
        this.$store.commit('deleteItem', {id: this.dataProps.id})
      }
    },
    drop: function (event, itemId) {
      this.$store.commit('moveItem', {id: itemId, stack: this.dataProps.id})
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
    }
  },
  components: {
    Sticker
  }
}
</script>

<style lang="scss" scoped>
.group {
  // position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  font-size: 2em;
  text-align: left;
  font-weight: 500;
  line-height: 1.2em;
  text-align: center;
  &.select {
    box-shadow: 0px 0px 10px blue;
    z-index: 20;
  }
  .group-inner {
    width: 100%;
    height: 100%;
    position: relative;
    .group-name {
      padding-left: 1.25em;
      padding-right: 1.25em;
      width: 100%;
      line-height: 1.5em;
      overflow: hidden;
      // font-size: 32px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .content {
      margin-left: 1.25em;
      width: calc(100% - 1.25em);
      height: calc(100% - 1.25em);
      // overflow: scroll;
    }
    .input-title {
      font-size: 18px;
      line-height: 2em;
      height: 2em;
      min-width: 300px;
      background-color: white;
      padding-left: 1.25em;
    }
  }
}
.toolbar-wrapper {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.sticker-options {
  display: inline-block;
  margin: 0;
  right: 0;
  bottom: 0px;
  z-index: 50;
}
.option-btns {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
