<template>
  <div>
  <!-- <v-app> -->
    <!-- <sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker"></sticker> -->
    <v-dialog v-model="qrcode" max-width="290">
      <v-card>
        <v-card-title class="headline">QR Code</v-card-title>
        <v-card-text><img width="100%" v-bind:src="qrUrl" /></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" flat="flat" @click.native="qrcode = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar
      floating
      fixed
      class="toolbar"
      dense
      >
      <!-- <v-text-field prepend-icon="search" hide-details single-line></v-text-field> -->
      <v-btn icon @click="decreaseScale"><v-icon>zoom_out</v-icon></v-btn>
      <!-- {{Math.floor(this.$store.getters.scale * 100)}} -->
      <v-btn icon @click="increaseScale"><v-icon>zoom_in</v-icon></v-btn>
      <v-btn icon @click.native="qrcode = true"><v-icon>screen_share</v-icon></v-btn>
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
            <v-list-tile @click="toggleFullScreen" tag="div">
              <v-list-tile-action> <v-icon>fullscreen</v-icon> </v-list-tile-action>
              <v-list-tile-title>Into FullScreen</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-cs-click="reload" tag="div">
              <v-list-tile-action> <v-icon>refresh</v-icon> </v-list-tile-action>
              <v-list-tile-title>Reload Page</v-list-tile-title>
            </v-list-tile>
            <v-subheader> Toggles </v-subheader>
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
    <hand/>    
    <room/>
  <!-- </v-app> -->
  </div>
</template>

<script>
import Hand from './Hand'
import Room from './Room'
import screenfull from 'screenfull'
import * as $http from 'superagent'

export default {
  data () {
    return {
      qrcode: false,
      qrUrl: '',
      displayLike: this.$store.getters.displayLike,
      fullScreen: false
    }
  },
  watch: {
    displayLike: function (newValue) {
      this.$store.commit('setDisplayLike', newValue)
    }
  },
  methods: {
    toggleFullScreen: function () {
      if (!this.fullScreen) {
        screenfull.request()
        this.fullScreen = true
      } else {
        this.fullScreen = false
        screenfull.exit()
      }
    },
    increaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) + 10)
    },
    decreaseScale: function () {
      this.$store.commit('setGlobalScale', (this.$store.getters.scale * 100) - 10)
    },
    openCreateNew: function () {
      this.$store.commit('setDisplayNewBoard', true)
    },
    reload: function () {
      location.reload(true)
    }
  },
  mounted () {
    $http.get('http://' + process.env.BACKEND_DOMAIN + '/qr')
        .query({url: location.href})
        .then(response => {
          this.qrUrl = response.text
        })
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
  @media all and (max-width: 500px){
    & {
      bottom: 0;
      right: 0;
    }
  }
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
