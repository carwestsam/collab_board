<template>
  <div class='hand' v-dropable>
    <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker>
  </div>
</template>
<script>

import Sticker from './Sticker'

export default {
  computed: {
    stickers: function () {
      let stickers = this.$store.getters.onHand
      console.log(stickers)
      stickers = stickers.map(sticker => { sticker.styleOffset = false; return sticker })
      console.log(stickers)
      return stickers
    }
  },
  components: {
    Sticker
  }
}
</script>

<style lang='scss'>
.hand {
  display: block;
  position: fixed;
  background-color: yellow;

  width: 800px;
  height: 200px;

  bottom: 20%;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto;
  z-index:1001;
}
</style>
