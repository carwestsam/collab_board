<template>
  <div>
    <v-app>
      <hand/>
      <!-- <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker> -->
      <v-toolbar
        color="white"
        floating
        fixed
        class="toolbar"
        dense
        >
        <!-- <v-text-field prepend-icon="search" hide-details single-line></v-text-field> -->
        <v-btn icon @click="decreaseScale"><v-icon>zoom_out</v-icon></v-btn>
        {{Math.floor(this.$store.getters.scale * 100)}}
        <v-btn icon @click="increaseScale"><v-icon>zoom_in</v-icon></v-btn>
        <v-menu :close-on-content-click="false" :close-on-click="true" top>
          <v-btn icon slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-card class="menu-expand">
            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-switch color="purple"></v-switch>
                </v-list-tile-action>
                <v-list-tile-title>Enable FullScreen</v-list-tile-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-switch color="purple"></v-switch>
                </v-list-tile-action>
                <v-list-tile-title>Enable Favorate</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </v-toolbar>
      <room/>
    </v-app>
  <div id="application" v-bind:style="{fontSize}">
    <div class="view-scope">
      <paper>
        <template v-for="item in items" >
          <sticker v-if="item.type==='sticker'" :key="item.id" :sticker="item"></sticker>
          <group v-if="item.type==='group'" :key="item.id" :group="item"></group>
        </template>
      </paper>
    </div>
  </div>
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
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) + 10)
    },
    decreaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) - 10)
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
  position: absolute;
  display: block;
  text-align: center;
  color: #2c3e50;
  // width: calc(100% - 20px);
  // height: calc(100% - 20px);
  max-width: calc(100% - 20px);
  max-height: calc(100% - 20px);
  left: 10px;
  top: 10px;
  margin: auto;
  overflow: scroll;
  background-color: pink;
  // font-size: 16px;  
}
.toolbar {
  top: auto;
  left: auto;
  bottom: 50px;
  right: 50px;
  font-size: 18px;
  z-index: 100;
}
#app {
  position: absolute;
  max-width: none;
  min-width: none;
  width: 100%;
  height: 100%;
}
.application--wrap{
  min-height: 0;
  // height: 100%;
}
.menu-expand {
  position: relative;
  left: 0;
  top: 0;
  width: auto;
  z-index: 102;
  visibility: visible;
}
</style>
