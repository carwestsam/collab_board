<template>
  <div>
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
      this.selectBoardDialog = false
    }
  },
  mounted () {
    const parser = new Path('/room/:room_id')
    let room = parser.partialTest(window.location.pathname)
    if (room) {
      $http.get('http://' + process.env.BACKEND_DOMAIN + '/room/' + room.room_id).then(response => {
        this.$store.commit('initItems', response.body)
        SocketManager.getInstance().send('join-room', JSON.stringify(room))
        console.log('commit')
      }, error => {
        console.log('err', error)
      })
    } else {
      this.selectBoardDialog = true
    }
  }
}
</script>

<style lang="scss">
</style>
