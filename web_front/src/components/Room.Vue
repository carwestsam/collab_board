<template>
  <div>
    <v-dialog v-if="selectBoardDialog" v-model="selectBoardDialog" max-width="500px" class="dialog" persistent>
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
                      label="Board Id"
                      id="testing"
                      v-model="boardId"></v-text-field>
                    <v-btn color="primary" dark @click.stop="jumpToBoard">Join</v-btn>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex sm6>
                <v-card>
                  <v-card-text>
                    <v-text-field
                      name="input-2"
                      label="Board Id"
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
  </div>
</template>

<script>
import SocketManager from '../store/SocketManager'
import Path from 'path-parser'
import * as $http from 'superagent'

export default {
  data () {
    return {
      selectBoardDialog: false,
      boardId: ''
    }
  },
  methods: {
    jumpToBoard: function () {
      location.href = '/room/' + this.boardId
      this.selectBoardDialog = false
    },
    createBoard: function () {
      $http.post('http://' + process.env.BACKEND_DOMAIN + '/room/create', {name: 'user created board'}).then(response => {
        location.href = '/room/' + response.body.item_id
        this.selectBoardDialog = false
      })
    }
  },
  mounted () {
    const parser = new Path('/room/:room_id')
    let room = parser.partialTest(window.location.pathname)
    if (room) {
      $http.get('http://' + process.env.BACKEND_DOMAIN + '/room/' + room.room_id).then(response => {
        this.$store.commit('initItems', response.body)
        SocketManager.getInstance().send('join-room', JSON.stringify(room))
        this.$store.commit('setOnLeaveNotification', true)
      }, error => {
        console.error('err', error)
      })
    } else {
      this.selectBoardDialog = true
    }
    window.onbeforeunload = (e) => {
      if (!this.$store.getters.onLeaveNotification) {
        return
      }
      if (!e) {
        e = window.event
      }
      // e.cancelBubble is supported by IE - this will kill the bubbling process.
      e.cancelBubble = true
      e.returnValue = 'You sure you want to leave?' // This is displayed on the dialog

      // e.stopPropagation works in Firefox.
      if (e.stopPropagation) {
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss">
.dialog {
  z-index: 100;
}
</style>
