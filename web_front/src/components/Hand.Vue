<template>
  <div class='hand' v-dropable="onDrop">
    <div class='items'>
      <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker>
      <div class="add-new-item">
        <button @click="addItem('sticker')">+ Sticker</button>
        <button @click="addItem('group')">+ Group</button>
      </div>
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
      this.$store.commit('moveItem', {id, stack: 'hand-' + this.$store.getters.userId})
    },
    addItem: function (type) {
      this.$store.commit('addItem', {type, stack: 'hand-' + this.$store.getters.userId})
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
  // align: center;
  z-index:50;
  .items {
    display: none;
  }

  .add-new-item {
    display: none;
    background-color: red;
    width: 100px;
    height: 100px;
    button {
      font-size: 20px;
      margin-top: 10%;
      margin-left: 5%;
      width: 90%;
      float: left;
    }
  }

  &:hover {
    width: 800px;
    height: 150px;
    background-color: gray;
    opacity: 1;
    // animation-delay: 0.2s; 
    animation: expand .3s;

    & > .items {
      // animation-delay: 1s;
      display: inline-block;
      animation: lastblink .3s;
    }
    &  .add-new-item {
      display: inline-block;
    }
  }

  // &:hover 

  &.dragover {
    // background-color: #333333;
    opacity: 1;
  }
}
</style>
