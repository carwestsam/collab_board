<template>
  <v-app light>
  <div>
  <mymenu/>
  <div id="application" v-bind:style="{fontSize}" touch-action='none'>
    <div class="view-scope">
      <paper>
        <template v-for="item in items" slot="board-items">
          <sticker v-if="item.type==='sticker'" :key="item.id" :sticker="item"></sticker>
          <group v-if="item.type==='group'" :key="item.id" :group="item"></group>
        </template>
      </paper>
    </div>
  </div>
  </div>
  </v-app>
</template>

<script>
import Paper from './components/Paper'
import Sticker from './components/Sticker'
import Hand from './components/Hand'
import Group from './components/Group'
import Mymenu from './components/mymenu'

export default {
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
        item.styleRemoveSize = false
        return item
      })
      // let items = this.$store.getters.items()
      // for (let i = 0; i < items.length; i += 1) {
      //   items[i].styleOffset = true
      //   items[i].styleRemoveSize = false
      // }
      return items
    },
    fontSize: function () {
      return 16 * this.$store.getters.scale + 'px'
    }
  },
  mounted () {
    this.$store.commit('initUser')
  },
  components: {
    Sticker,
    Group,
    Hand,
    Mymenu,
    Paper
  }
}
</script>

<style lang="scss">
@import './directives/resizable.scss';
@import './directives/draggable.scss';
</style>

<style lang='scss'>
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
  position: absolute;
  display: block;
  text-align: center;
  color: #2c3e50;
  // width: calc(100% - 20px);
  // height: calc(100% - 20px);
  max-width: calc(100% - 20px);
  max-height: calc(100% - 20px);
  left: 10px;
  top: 10px;
  margin: auto;
  overflow: scroll;
  background-color: pink;
  // font-size: 16px;
  .a {
    color: black
  }
}
</style>
