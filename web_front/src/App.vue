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
      <v-dialog v-model="selectBoardDialog" max-width="500px" persistent>
          <v-card>
            <v-card-title>
              Please Select a Board
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                  <v-flex sm6>
                    <v-card>
                      <v-card-text>
                        <v-text-field
                          name="input-1"
                          label="Board Id or URL"
                          id="testing"></v-text-field>
                        <v-btn color="primary" dark @click.stop="jumpToBoard">Join</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex sm6>
                    <v-card>
                      <v-card-text>
                        <v-text-field
                          name="input-2"
                          label="Board Id or URL"
                          value="Will Random Generate"
                          disabled></v-text-field>
                        <v-btn color="primary" dark @click.stop="createBoard">Create New</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
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
      selectBoardDialog: true,
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
  methods: {
    jumpToBoard: function () {
      this.selectBoardDialog = false
    },
    createBoard: function () {
      this.selectBoardDialog = false
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
