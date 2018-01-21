<template>
  <item
    :uuid='this.dataProps.id'
    :itemStyleObject='this.itemStyleObject'
    :itemOptions='this.itemOptions'
    class='group'
    >
    <template slot='content'>
      <div class='group-inner' style='{height:"100%"}' v-dropable="drop">
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
          
        <div class="group-content">
          <template v-for="item in items" >
            <sticker v-if="item.type==='sticker'" :key="item.id" :sticker="item"></sticker>
            <group v-if="item.type==='group'" :key="item.id" :group="item"></group>
          </template>
        </div>

      </div>
    </template>

    <template slot='toolbar-options'>
      <v-btn color="primary" flat icon @mousedown.prevent="intoEdit">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
  </item>
</template>
<script>
import Vue from 'vue'
import Sticker from './Sticker'
import Item from './Item'

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
    itemOptions: function () {
      return {
        displayLike: false,
        enableOffset: this.styleProps.styleOffset,
        enableResize: this.styleProps.styleOffset,
        toolbarPosition: 'tr'
      }
    },
    itemStyleObject: function () {
      let style = {
        textAlign: 'center'
      }
      if (this.styleProps.styleOffset === false) {
        style.display = 'inline-block'
        style.position = 'relative'
        style.width = '100%'
        style.height = 'none'
        style.fontSize = '0.8em'
        style.textAlign = 'left'
        delete style.left
        delete style.top
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
    drop: function (event, itemId) {
      let idx = this.dataProps.id
      let idy = itemId
      let objectX = this.$store.getters.getItemById(idx)
      while (objectX.stack !== 'board' && idx.substring(0, 5) !== 'hand-') {
        if (objectX.stack === idy) {
          return false
        }
        idx = objectX.stack
        objectX = this.$store.getters.getItemById(idx)
      }

      this.$store.commit('moveItem', {id: itemId, stack: this.dataProps.id})
      return true
    }
  },
  components: {
    Sticker,
    Item
  }
}
</script>

<style lang="scss" scoped>
.group {
  // position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  text-align: left;
  font-weight: 500;
  line-height: 1.2em;
  text-align: center;
  min-height: 2em;
  order: 2;
  .group-inner {
    width: 100%;
    height: 100%;
    position: relative;
    .group-name {
      padding-left: 2em;
      padding-right: 2em;
      width: 100%;
      line-height: 2em;
      font-size: 2em;
      overflow: hidden;
      // font-size: 32px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .group-content {
      margin-left: 2em;
      width: calc(100% - 2em);
      // height: calc(100% - 1.25em);
      clear: both;
      display: flex;
      flex-wrap: wrap;
      // overflow: scroll;
    }
    .input-title {
      font-size: 32px;
      line-height: 2em;
      height: 2em;
      padding: 1em 0;
      min-width: 300px;
      background-color: white;
      padding-left: 2em;
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
