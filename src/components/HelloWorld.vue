<template>
<div class="hello">
  <p class="btns">
    <button @click="changeListCount(10)">增加10条</button>
    <button @click="changeListCount(-10)">减少10条</button>
    <button @click="vif = !vif">on/off</button>
    <!-- <button @click="switchKeep">keep switch</button> -->
  </p>
  <ul v-if="vif" class="scrollbar-demo" ref="scrollbar-demo" v-scrollbar="scrollbarOptions">
    <li v-for="(n, i) in list" :key="i">{{ i + 1 }}. {{ n }}</li>
  </ul>
</div>
</template>

<script>
import math from '@catnap/math.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      vif: true,
      listCount: 30,
      scrollbarOptions: {
        // keep: true,
        skidwayStyle: {
          'background-color': 'rgba(40, 44, 52, .1)',
          'border-radius': '8px'
        },
        sliderStyle: {
          'background-color': 'rgba(97, 163, 191, 1)',
          'border-radius': '8px'
        }
      }
    }
  },
  methods: {
    changeListCount (c) {
      this.listCount = math.range(10, 100).in(this.listCount + c)
    }
    // switchKeep () {
    //   this.$set(this.scrollbarOptions, 'keep', !this.scrollbarOptions.keep)
    //   this.$refs['scrollbar-demo'].scrollbar.setOption(this.scrollbarOptions.keep)
    // }
  },
  computed: {
    list () {
      return Array(this.listCount).fill('Lorem ipsum dolor sit amet, consectetur adipisicing elit.')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.scrollbar-demo {
  display: block;
  width: 20%;
  height: 300px;
  margin: 30px auto;
  border: 1px solid #ccc;
  li {
    width: 400px;
  }
}
.btns {
  text-align: center;
  margin-top: 30px;
}
</style>
