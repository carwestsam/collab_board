<template>
<div class="paper" v-bind:style="styleObject" v-selectable v-dropable>
  <slot name="board-items"></slot>
</div>
</template>

<script>
import _ from 'lodash'
import constants from '../../../shared_components/constants.mjs'
let defaultFontSize = constants.default_font_size

export default {
  props: ['paper'],
  name: 'paper',
  data () {
    return {
      styleProps: {
        width: _.get(this.paper, 'width', 4200) / defaultFontSize + 'em',
        height: _.get(this.paper, 'height', 2970) / defaultFontSize + 'em',
        fontSize: defaultFontSize
      }
    }
  },
  computed: {
    styleObject: function () {
      let style = {
        width: this.styleProps.width,
        height: this.styleProps.height,
        fontSize: defaultFontSize * this.$store.getters.scale + 'px'
      }
      return style
    }
  },
  render: function (createElement) {
    return createElement('div', {
      'class': {
        'paper': true
      },
      'style': this.styleObject,
      directives: [
        {name: 'selectable'},
        {name: 'dropable'}
      ]
    }, this.$slots.default)
  }
}
</script>
<style lang="scss">
.paper{
  background-color: white;
  display: block;
  position: relative;
  width: 4200px;
  height: 2970px;
}
</style>
