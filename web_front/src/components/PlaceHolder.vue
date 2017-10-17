<template>
  <div v-bind:style="styleObject"></div>
</template>
<script>
export default {
  props: ['visibleBlock', 'position'],
  computed: {
    styleObject: function () {
      console.log('computed', this.visibleBlock)
      return {
        width: this.visibleBlock.width + 'px',
        height: this.visibleBlock.height + 'px',
        'background-color': this.visibleBlock.bgColor
      }
    }
  }
}
</script>
