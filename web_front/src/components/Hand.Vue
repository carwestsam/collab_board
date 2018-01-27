<template>
  <v-card class='hand' v-dropable="onDrop">
    <div class="actions">
      <v-layout justify-space-around>
        <v-icon medium class="actions-toggle">expand_more</v-icon>
        <v-icon light medium color='gray' class="actions-handle">drag_handle</v-icon>
        <v-icon medium class="actions-expand">code</v-icon>
      </v-layout>
    </div>
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
  z-index: 100;
  bottom: 50px;
  left: 40px;
  padding-top: 20px;

  .actions {
    position: relative;
    display: block;
    left: 0;
    right: 0;
    margin: auto;
    top: -20px;
    .actions-handle {
      cursor: move;
    }
    .actions-toggle, .actions-expand {
      cursor: pointer;
    }
  }

  .items {
    position: relative;
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
