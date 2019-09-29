<template>
<div class="hello">
  <ul class="scrollbar-demo" v-scrollbar="scrollbarOptions">
    <li v-for="(n, i) in list" :key="i">{{ n }}</li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: Array(30).fill('Lorem ipsum dolor sit amet, consectetur adipisicing elit.'),
      scrollbarOptions: {
        test: 111
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.scrollbar-demo {
  width: 300px;
  height: 475px;
  margin: 20px;
  border: 1px solid #ccc;
}
</style>
