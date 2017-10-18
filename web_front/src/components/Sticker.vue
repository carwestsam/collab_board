<template>
  <div
    v-bind:style="styleObject"
    v-bind:class="{select: statusProps.selected}"
    @mouseup="select"
    v-draggable="statusProps.draggable"
    class="sticker">
    Work {{dataProps.id.substring(0,6)}}
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
        selected: false,
        draggable: false
      },
      dataProps: {
        id: this.sticker.id
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
      console.log('click')
      if (this.statusProps.selected === false) {
        this.statusProps.selected = true
        this.statusProps.draggable = true
      } else {
        this.statusProps.selected = false
        this.statusProps.draggable = false
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
