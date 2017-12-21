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
    <div id="holder"></div>
    <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title>
            Dialog 2
          </v-card-title>
          <v-card-text>
            <v-btn color="primary" dark @click.stop="dialog3 = !dialog3">Open Dialog 3</v-btn>
          </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="dialog2=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
       </v-app>
  </div>
</template>

<script>
import Paper from './components/Paper'
import Sticker from './components/Sticker'
import Hand from './components/Hand'
import Group from './components/Group'
import * as $http from 'superagent'
import Path from 'path-parser'

export default {
  // name: 'app',
  data () {
    return {
      dialog2: true,
      dialog3: false
    }
  },
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
  beforeCreate () {
  },
  mounted () {
    this.$store.commit('initUser')
    const parser = new Path('/room/:room_id')
    let room = parser.partialTest(window.location.pathname)
    if (room) {
    } else {
    }
    console.log('current path')
    $http.get('http://' + process.env.BACKEND_DOMAIN).then(response => {
      this.$store.commit('initItems', response.body)
      console.log('commit')
    }, error => {
      console.log('err', error)
    })
  },
  components: {
    Paper,
    Sticker,
    Group,
    Hand
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
