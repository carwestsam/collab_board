<template>
<div v-bind:style="itemStyle"
  v-bind:class="{select: statusProps.selected}"
  v-selectable="statusProps.selected">
  <div class="item-wrapper">
    <div class="content-wrapper" v-draggable="statusProps.draggable">
      <slot name="content" ></slot>
    </div>
    <div v-if="likeBar" class="like-wrapper">
      <div>
        <v-icon large color="pink" v-bind:style="{fontSize:'1.4em'}">thumb_up</v-icon>
        <span>{{$store.getters.likes(dataProps.id)}}</span>
      </div>
    </div>
    <div class="toolbar-wrapper" v-if="this.statusProps.selected && !this.statusProps.editing">
      <v-toolbar
      slot="toolbar"
      color="white"
      floating
      class="item-options"
      dense
      >
        <slot name="toolbar"></slot>
      </v-toolbar>
    </div>
  </div>
</div>
</template>

<script>
import constants from '../../../shared_components/constants.mjs'
import _ from 'lodash'

export default {
  name: 'item',
  props: ['uuid', 'itemid', 'itemStyleObject', 'itemOptions'],
  data () {
    let item = this.$store.getters.getItemById(this.uuid)
    // console.log('uuid', this.uuid, item, this.itemStyleObject)
    return {
      styleProps: {
        width: item.width || 120,
        height: item.height || 120,
        left: item.left || 100,
        top: item.top || 100
      },
      statusProps: {
        selected: false,
        draggable: true,
        editing: false,
        resizable: false
      },
      dataProps: {
        id: this.uuid
      }
    }
  },
  computed: {
    itemStyle: function () {
      let style = _.merge({
        width: this.styleProps.width / constants.default_font_size + 'em',
        height: this.styleProps.height / constants.default_font_size + 'em',
        left: this.styleProps.left / constants.default_font_size + 'em',
        top: this.styleProps.top / constants.default_font_size + 'em'
      }, this.itemStyleObject)
      if (this.itemOptions.enableOffset === false) {
        delete style.left
        delete style.top
      }
      return style
    },
    likeBar: function () {
      return this.itemOptions.displayLike === true &&
            !this.statusProps.selected &&
            this.$store.getters.displayLike &&
            this.$store.getters.likes(this.dataProps.id) > 0
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
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  position: absolute;
  display: block;
  background-color: yellow;
  user-select: none;
  font-size: 1em;
  text-align: left;
  &.select {
    box-shadow: 0px 0px 10px blue;
    z-index: 20;
  }
}
.item-wrapper {
  clear: both;
  position: relative;
  width: 100%;
  height: 100%;
}
.content-wrapper {
  clear: both;
}
.toolbar-wrapper {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .item-options {
    display: inline-block;
    margin: 0;
    right: 0;
    bottom: 0px;
    z-index: 50;
    .option-btns {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}

.like-wrapper {
  position: absolute;
  right: 0;
  bottom: .3em;
  background-color: white;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  padding: .2em 1em;
  font-weight: 600;
  line-height: 2em;
}
</style>