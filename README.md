<div align="center">
  <h1>vue-scrollbar-directive</h1>.
  Uses the custom instruction in VUE to realize the custom scrollbar effect.
  <h3>Now open testing!</h3>
</div>

### Install package
```npm
npm install --save vue-scrollbar-directive
```

### Start using!

Introduce packages in the `main.js` file.
You can set up the global configuration here.

```javascript
import vueScrollbarDirective from 'vue-scrollbar-directive'

Vue.use(vueScrollbarDirective)
// Vue.use(vueScrollbarDirective, global_option)
```

Add the `v-scrollbar` attribute to the element to use the directive.

```html
<div class="container" v-scrollbar>
  <!-- something -->
</div>
```

You can also configure it to work locally like this.

```vue
<template>
  <div class="demoVue">
    <div class="container" v-scrollbar="option">
      <!-- something -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: {
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
  }
}
</script>

<style>
// style
</style>
```

Here are all the configurable items:

```javascript
// default configuration
option = {
  x: true, // Whether to display horizontal scroll bar
  y: true, // Whether to display vertical scrollbars
  width: 8, // scrollbar width
  widthOnHover: 16, // scrollbar width in mouse hover
  wheelDistance: 50, // Distance of Rolling Wheel Rolling Once
  keep: false, // Whether to keep the display, default `false`, hide the scrollbar when the mouse moves out
  // skidway style, Support CSS Style, jQuery(elem).css()
  skidwayStyle: {
    'background-color': '#F1F1F1'
  },
  // slider style, Support CSS Style, jQuery(elem).css()
  sliderStyle: {
    'background-color': '#C1C1C1'
  }
}
```
