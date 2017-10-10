<template>
  <div
    v-bind:style="styleObject" class="sticker">
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
  }
}
</script>
<style lang="scss">
.sticker{
  position: absolute;
  display: block;
  color: pink;
  background-color: yellow;
}
</style>
