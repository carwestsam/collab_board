<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected}"
    @click="select"
    class="sticker">
    Work
  </div>
</template>
<script>
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
        selected: false
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
    }
  },
  methods: {
    select: function () {
      if (this.statusProps.selected === false) {
        this.statusProps.selected = true
      } else {
        this.statusProps.selected = false
      }
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
  &.select {
    box-shadow: 0px 0px 2px blue;
  }
}
</style>
