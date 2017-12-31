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
  </div>
</template>

<script>
import Hand from './Hand'
import Room from './Room'

export default {
  methods: {
    increaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) + 10)
    },
    decreaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) - 10)
    }
  },
  components: {
    Room,
    Hand
  }
}
console.log('x')
</script>

<style lang='scss'>
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
