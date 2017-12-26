<template>
  <div id="application">
    <v-app>
      <paper/>
      <hand/>
      <!-- <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker> -->
      <template v-for="item in items" >
        <sticker v-if="item.type==='sticker'" :key="item.id" :sticker="item"></sticker>
        <group v-if="item.type==='group'" :key="item.id" :group="item"></group>
      </template>
      <!-- <div id="holder"></div> -->
      <room/>
    </v-app>
  </div>
</template>

<style lang="scss">
@import './directives/resizable.scss'
</style>

<script>
import Paper from './components/Paper'
import Sticker from './components/Sticker'
import Hand from './components/Hand'
import Group from './components/Group'
import Room from './components/Room'

export default {
  // name: 'app',
  computed: {
    stickers: function () {
      let stickers = this.$store.getters.stickers.map(sticker => {
        sticker.styleOffset = true
        return sticker
      })
      return stickers
    },
    items: function () {
      let items = this.$store.getters.items().map(item => {
        item.styleOffset = true
        return item
      })
      return items
    }
  },
  mounted () {
    this.$store.commit('initUser')
  },
  components: {
    Paper,
    Sticker,
    Group,
    Hand,
    Room
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
#application {
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
