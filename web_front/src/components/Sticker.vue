<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected}"
    v-draggable="statusProps.draggable"
    v-selectable="statusProps.selected"
    class="sticker">
    <!-- Work {{dataProps.id.substring(0,6)}} -->
    {{dataProps.text}}
    <textarea
      ref="textInput"
      v-bind:style="inputOverlayStyleObject"
      v-on:blur="outsideEdit"
      v-model="dataProps.text"
      class="input-overlay"/>
    
    <button 
      v-if="this.statusProps.selected"
      @mousedown.prevent="intoEdit"
      class='edit-button'>Edit</button>
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
        width: 100,
        height: 100,
        left: this.sticker.left || 100,
        top: this.sticker.top || 100,
        bg_color: this.sticker.bg_color || 'yellow'
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
      return {
        width: this.styleProps.width + 'px',
        height: this.styleProps.height + 'px',
        left: this.styleProps.left + 'px',
        top: this.styleProps.top + 'px',
        'background-color': this.styleProps.bg_color
      }
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
    },
    unselect: function () {
      this.statusProps.selected = false
    },
    intoEdit: function () {
      this.statusProps.editing = true
      // let self = this
      Vue.nextTick(() => {
        this.$refs.textInput.focus()
      })
      console.log('into')
    },
    outsideEdit: function () {
      this.statusProps.editing = false
      this.$store.commit('updateStickerText', {id: this.dataProps.id, text: this.dataProps.text})
    }
  }
}
</script>
<style lang="scss">
.sticker {
  position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  font-size: 18px;
  line-height: 1.2em;
  &.select {
    box-shadow: 0px 0px 2px blue;
    z-index: 100;
  }
}
.edit-button {
  position: absolute;
  display: block;
  right: 0;
  bottom: 0;
}
.input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 18px;
  line-height: 1.2em;
  text-align: center;
}
</style>
