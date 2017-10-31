<template>
  <div class='hand' v-dropable="onDrop">
    <div class='items'>
      <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker>      
    </div>
  </div>
</template>
<script>

import Sticker from './Sticker'
import SelectMgr from '../directives/selectable.js'

export default {
  computed: {
    stickers: function () {
      let stickers = this.$store.getters.onHand
      stickers = stickers.map(sticker => { sticker.styleOffset = false; return sticker })
      return stickers
    }
  },
  methods: {
    onDrop: function (event) {
      let selectMgr = SelectMgr.getInstance()
      // debugger
      let id = selectMgr.selected[0].context.dataProps.id
      this.$store.commit('moveStickerToHand', {id})
    }
  },
  components: {
    Sticker
  }
}
</script>

<style lang='scss'>

@keyframes expand { 
  0% {
    width:  150px;
  }
  70% {
    width: 200px;
  }
  100% {
    width: 800px;
  }
}

@keyframes lastblink {
  0% {
    opacity: 0;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.hand {
  display: block;
  position: fixed;
  background-color: gray;
  opacity: 0.3;

  width: 150px;
  height: 150px;

  bottom: 20%;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto;
  align: center;
  z-index:1001;
  .items {
    display: none;
  }

  &:hover {
    width: 800px;
    height: 150px;
    background-color: gray;
    opacity: 1;
    // animation-delay: 0.2s; 
    animation: expand .3s;
  }

  &:hover > .items {
    // animation-delay: 1s;
    display: inline-block;
    animation: lastblink .3s;
  }

  &.dragover {
    // background-color: #333333;
    opacity: 1;
  }
}
</style>
