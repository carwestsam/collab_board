<template>
  <div id="app">
    <paper/>
    <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker>
    <!-- <sticker/> -->
    {{stickers}}
  </div>
</template>

<script>
import Paper from './components/Paper'
import Sticker from './components/Sticker'

export default {
  name: 'app',
  computed: {
    stickers: function () {
      console.log(this.$store.getters.stickers)
      return this.$store.getters.stickers
    }
  },
  components: {
    Paper,
    Sticker
  }
}
</script>

<style>
*{
  margin: 0;
  border: 0;
  padding: 0;
}
body{
  background-color: black;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
  left: 0;
  top: 0;
  position: absolute;
  display: block;
  text-align: center;
  color: #2c3e50;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  left: 10px;
  top: 10px;
  overflow: scroll;
  background-color: pink;
}
</style>
