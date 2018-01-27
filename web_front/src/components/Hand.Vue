<template>
  <v-card class='hand' v-dropable="onDrop"
    v-resize="onWindowResize"
    v-bind:class="{'minimum': minimum}"
    v-bind:style="style">
    <div class="minimum-hand" v-if="minimum"><v-btn fab medium @click="toggleMinimum"><v-icon medium>inbox</v-icon></v-btn></div>
    <div class="actions" v-fix-move="'lb'">
      <v-layout justify-space-around>
        <v-icon medium class="actions-toggle" v-cs-click="toggleMinimum">expand_more</v-icon>
        <v-icon light large color='gray' class="actions-handle" >drag_handle</v-icon>
        <!-- <v-icon medium class="actions-expand">code</v-icon> -->
      </v-layout>
          <v-divider></v-divider>
    </div>
    <v-layout justify-space-around><v-icon class='inbox-logo'>inbox</v-icon></v-layout>
    <div class='items'>
      <div class="hand-item-wrapper">
        <template>
          <div v-for="sticker in stickers" :key="sticker.id" class="hand-item">
            <sticker :sticker="sticker" :styleRemoveSize="true" :scale="1.0"></sticker>
          </div>
        </template>
      </div>
    </div>
    <div class="add-new-item">
      <v-btn color="primary" dark @click="addItem('sticker')">+ Sticker</v-btn>
      <v-btn color="primary" dark  @click="addItem('group')">+ Group</v-btn>
    </div>
  </v-card>
</template>
<script>

import Sticker from './Sticker'
import Group from './Group'
import Item from './Item'
import SelectMgr from '../directives/selectable.js'

export default {
  data () {
    this.$store.commit('initUser')
    return {
      minimum: !!window.MOBILE,
      shiftdown: -1,
      dataProps: {
        id: 'hand-' + this.$store.getters.userId
      },
      styleProps: {
        bottom: 100,
        left: 28
      }
    }
  },
  computed: {
    stickers: function () {
      let stickers = this.$store.getters.onHand
      stickers = stickers.map(sticker => {
        sticker.styleOffset = false
        sticker.styleRemoveSize = true
        return sticker
      })
      return stickers
    },
    items: function () {
      let items = this.$store.getters.onHand.map(item => {
        item.styleOffset = false
        return item
      })
      return items
    },
    style: function () {
      if (this.minimum === true) {
        return {}
      }

      let style = {
        left: this.styleProps.left + 'px',
        bottom: this.styleProps.bottom + 'px'
      }
      return style
    }
  },
  methods: {
    onDrop: function (event) {
      let selectMgr = SelectMgr.getInstance()
      let id = selectMgr.selected[0].context.dataProps.id
      this.$store.commit('moveItem', {id, stack: 'hand-' + this.$store.getters.userId})
      return true
    },
    addItem: function (type) {
      this.$store.commit('addItem', {type, stack: 'hand-' + this.$store.getters.userId})
    },
    onWindowResize: function () {
      if (this.styleProps.bottom > window.innerHeight - 400) {
        this.shiftdown = this.styleProps.bottom
        this.styleProps.bottom = 20
      } else {
        if (this.shiftdown !== -1) {
          this.styleProps.bottom = this.shiftdown
          this.shiftdown = -1
        }
      }
    },
    toggleMinimum: function () {
      this.minimum = !this.minimum
    }
  },
  components: {
    Sticker,
    Group,
    Item
  }
}
</script>

<style lang='scss'>

.hand {
  display: block;
  position: fixed;
  z-index: 50;
  bottom: 60px;
  left: 60px;
  padding-top: 20px;

  @media all and (max-width: 500px){
    & {
      bottom: 10px;
      left: 20px;
    }
  }

  &.minimum {
    padding: 0;
    border: none;
    box-shadow: none;
    background-color: transparent;
    .actions, .items, .add-new-item, .inbox-logo {
      display: none
    }
  }

  .actions {
    user-select: none;
    position: relative;
    display: block;
    left: 0;
    right: 0;
    margin: auto;
    top: -20px;
    cursor: move;
    .actions-handle {
      cursor: move;
    }

    @media all and (min-height: 760px) and (min-width: 600px) {
      .actions-toggle {
        display: none;
      }
    }
    .actions-toggle, .actions-expand {
      cursor: pointer;
    }
  }

  .inbox-logo {
      position: absolute;
      top: 30%;      
      height: 40%;
      text-align: center;
      bottom: 0;
      font-size: 60px;
      user-select: none;
    }

  .items {
    position: relative;
    min-height: 60px;
    left: 20px;
    .hand-item-wrapper {
      display: inline-block;
      position: relative;
      clear: both;
      &::after {
          content: "";
          clear: both;
          display: table;
      }
      .hand-item {
        display: block;
        position: absolute;
        left: 0;
        border-left: 1px solid white;

        &:first-child {
          margin: auto;
          position: relative;
          left: 0px;
          float: left;
        }
        &:nth-last-child(1) {
          left: 70px;
        }
        &:nth-last-child(2) {
          left: 35px;
        }
        &:nth-last-child(3) {
          left: 0;
        }
      }
    }
  }
}

</style>
