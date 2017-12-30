<template>
  <div id="application" v-bind:style="{fontSize}">
    <v-app>
      <hand/>
      <!-- <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker> -->
      <div class="view-scope">
        <paper/>
        <template v-for="item in items" >
          <sticker v-if="item.type==='sticker'" :key="item.id" :sticker="item"></sticker>
          <group v-if="item.type==='group'" :key="item.id" :group="item"></group>
        </template>
      </div>
      <v-toolbar
        color="white"
        fixed
        floating
        class="toolbar"
        dense
        >
        <!-- <v-text-field prepend-icon="search" hide-details single-line></v-text-field> -->
        <v-btn icon @click="decreaseScale"><v-icon>zoom_out</v-icon></v-btn>
        <v-btn icon @click="increaseScale"><v-icon>zoom_in</v-icon></v-btn>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
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
    },
    fontSize: function () {
      return 16 * this.$store.getters.scale + 'px'
    }
  },
  methods: {
    increaseScale: function () {
      this.$store.commit('setGlobalScale', this.$store.getters.scale + 0.1)
    },
    decreaseScale: function () {
      this.$store.commit('setGlobalScale', this.$store.getters.scale - 0.1)
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

<style lang='scss'>
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
  // font-size: 16px;  
}
.toolbar {
  top: auto;
  left: auto;
  bottom: 50px;
  right: 50px;
}
.view-scope {
  zoom: 1;
  // transform: scale(0.4);
  -moz-transform: scale(0.4);
  -moz-transform-origin: 0 0;
}
</style>
