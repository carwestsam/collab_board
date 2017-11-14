<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected}"
    v-draggable="statusProps.draggable"
    class="group"
    v-dropable="drop"
    v-selectable>
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
      <span class="option-btns">
        <button 
        v-if="this.statusProps.selected"
        @mousedown.prevent="intoEdit"
        class='edit-button'>Edit</button>
        <button
          v-if="this.statusProps.selected"
          @mousedown.prevent="deleteGroup"
          class="delete-button">
          Delete
        </button>
      </span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Sticker from './Sticker'
// import selectMgr from '../directives/selectable'

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
        style.width = '100%'
        style.height = 'auto'
        // style['z-index'] = '1001'
        delete style.left
        delete style.top
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
    deleteGroup: function () {
      let confirmDelete = confirm('Do you want to delete Group: \n' + this.dataProps.text + '\n')
      if (confirmDelete) {
        this.$store.commit('deleteItem', {id: this.dataProps.id})
      }
    },
    drop: function (event, itemId) {
      // console.log('group drop', event, targetId)
      this.$store.commit('moveItem', {id: this.dataProps.id, itemId})
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
    .group-name {
      width: 100%;
      overflow: hidden;
      font-size: 32px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .content {
      margin-left: 5%;
      width: 90%;
      height: 90%;
      // overflow: scroll;
    }
    .input-title {
      font-size: 1em;
    }
  }
}
.option-btns {
  position: absolute;
  right: 0;
  top: 0;
}
.edit-button {
  display: inline-block;
}
.delete-button {
  display: inline-block;
}
</style>
