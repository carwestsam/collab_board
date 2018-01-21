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
      <v-menu :close-on-content-click="true" :close-on-click="true" top>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-card class="menu-expand">
          <v-list>
            <v-subheader> General </v-subheader>
            <v-list-tile @click="openCreateNew" tag="div">
              <v-list-tile-action> <v-icon>add_to_queue</v-icon> </v-list-tile-action>
              <v-list-tile-title>Select a Board</v-list-tile-title>
            </v-list-tile>
            <v-subheader> Toggles </v-subheader>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch color="purple" v-model="toggleFullScreen"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Enable FullScreen</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch color="purple" v-model="displayLike"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Enable Favorate</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
    <room/>
  </v-app>
  </div>
</template>

<script>
import Hand from './Hand'
import Room from './Room'
import screenfull from 'screenfull'

export default {
  data () {
    return {
      displayLike: this.$store.getters.displayLike,
      toggleFullScreen: false
    }
  },
  watch: {
    displayLike: function (newValue) {
      this.$store.commit('setDisplayLike', newValue)
    },
    toggleFullScreen: function (newValue) {
      if (newValue) {
        screenfull.request()
      } else {
        screenfull.exit()
      }
    }
  },
  methods: {
    increaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) + 10)
    },
    decreaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) - 10)
    },
    openCreateNew: function () {
      this.$store.commit('setDisplayNewBoard', true)
    }
  },
  components: {
    Room,
    Hand
  }
}
</script>

<style lang='scss'>
.toolbar {
  top: auto;
  left: auto;
  bottom: 50px;
  right: 50px;
  font-size: 18px;
  z-index: 100;
  user-select: none;
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
