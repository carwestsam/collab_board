<template>
  <div>
    <v-dialog v-if="selectBoardDialog" v-model="selectBoardDialog" max-width="500px" class="dialog" :persistent="dialogPersistent">
      <v-card flat>
        <v-card-title>
          Please Select a Board
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex sm6>
                <v-card>
                  <v-card-text>
                    Recent BoardX
                  </v-card-text>
                </v-card>
                <v-card>
                  <v-card-text>
                    Recent BoardY
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex sm6>
                <v-card>
                  <v-card-text>
                    <v-text-field
                      name="input-name"
                      label="Board Name"
                      v-model="boardName"
                      value=""></v-text-field>
                    <v-select
                      v-bind:items="boardTemplates"
                      v-model="boardTemplate"
                      label="select a template"
                      bottom></v-select>
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

function getRoom () {
  const parser = new Path('/room/:room_id')
  return parser.partialTest(window.location.pathname)
}

export default {
  data () {
    return {
      boardId: '',
      boardName: '',
      dialogPersistent: false,
      boardTemplate: 'default',
      boardTemplates: [
        {text: 'Tutorial', value: 'tutorial'},
        {text: 'Empty Retrospect', value: 'empty_retro'},
        {text: 'Sample Retrospect', value: 'sample_retro'}
      ]
    }
  },
  methods: {
    jumpToBoard: function () {
      location.href = '/room/' + this.boardId
      this.$store.commit('setDisplayNewBoard', false)
    },
    createBoard: function () {
      $http.post('http://' + process.env.BACKEND_DOMAIN + '/room/create', {name: this.boardName, template: this.boardTemplate}).then(response => {
        location.href = '/room/' + response.body.item_id
        this.$store.commit('setDisplayNewBoard', false)
        this.$store.commit('setOnLeaveNotification', false)
      })
    }
  },
  computed: {
    selectBoardDialog: {
      get: function () {
        return this.$store.getters.displayNewBoard
      },
      set: function () {
        return this.$store.commit('setDisplayNewBoard', false)
      }
    }
  },
  watch: {
    selectBoardDialog: function () {
      if (getRoom()) {
        this.dialogPersistent = false
      } else {
        this.dialogPersistent = true
      }
    }
  },
  mounted () {
    let room = getRoom()
    if (room) {
      $http.get('http://' + process.env.BACKEND_DOMAIN + '/room/' + room.room_id).then(response => {
        this.$store.commit('initItems', response.body.content)
        if (response.body.name) {
          document.title = response.body.name
        }
        SocketManager.getInstance().send('join-room', JSON.stringify(room))
        this.$store.commit('setOnLeaveNotification', true)
      }, error => {
        console.error('err', error)
      })
    } else {
      this.$store.commit('setDisplayNewBoard', true)
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
</style>
