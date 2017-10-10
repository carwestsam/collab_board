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
  data () {
    return {
      styleProps: {
        width: 100,
        height: 100,
        left: 100,
        top: 100
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
        height: this.styleProps.width + 'px',
        left: this.styleProps.width + 'px',
        top: this.styleProps.width + 'px'
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
