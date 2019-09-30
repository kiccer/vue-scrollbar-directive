import $ from 'jquery'
import 'jquery-mousewheel'
import math from '@catnap/math.js'

// scrollbar 构造函数
const Scrollbar = function (el, option) {
  let that = this
  this.el = $(el) // 需要添加scrollbar的容器
  this.id = this.getId() // 获取唯一 id
  // 创建元素
  this.skidwayX = $('<div class="skidwayX">') // 横向滚动条滑道
  this.skidwayY = $('<div class="skidwayY">') // 纵向滚动条滑道
  this.sliderX = $('<div class="sliderX">') // 横向滚动条滑块
  this.sliderY = $('<div class="sliderY">') // 纵向滚动条滑块
  // 监听对象
  this.watch = {
    // 最终生效配置
    _option: Object.assign({}, this.initOptions, option),
    get option () {
      return this._option
    },
    set option (opt) {
      this._option = opt
      that.update('option')
    },
    // 滚动条位置，页面位置 (比例)
    _position: { x: 0, y: 0 },
    get position () {
      return this._position
    },
    set position (pos) {
      this._position = pos
      that.update('position')
    }
  }
  // 初始化
  this.initScrollbar()
  // 将实例挂载到元素上
  this.el.scrollbar = this
  // 调用更新视图方法
  this.update()
}

// 构造函数内部方法
;((Sp) => {
  // 唯一下标
  Sp.index = 0

  // 获取唯一 id
  Sp.getId = function () {
    return `scrollbar_${Date.now()}_${Sp.index++}`
  }

  // 设置 option
  Sp.setOption = function (obj) {
    this.watch.option = Object.assign({}, this.watch.option, obj)
  }

  // 设置 position
  Sp.setPosition = function (obj) {
    this.watch.position = Object.assign({}, this.watch.position, obj)
  }

  // 默认配置
  Sp.initOptions = {
    // 默认配置 (完整)
    x: true, // 是否显示横线滚动条
    y: true, // 是否显示纵向滚动条
    width: 8, // 滚动条粗细
    widthOnHover: 16, // 鼠标悬浮时滚动条粗细
    wheelDistance: 50, // 滚轮滚一次滚动的距离
    keep: false, // 是否保持显示，默认false，鼠标移出时隐藏滚动条
    // 滑道样式，支持 css 样式，jQuery(elem).css()
    skidwayStyle: {
      'background-color': '#F1F1F1'
    },
    // 滑块样式，支持 css 样式，jQuery(elem).css()
    sliderStyle: {
      'background-color': '#C1C1C1'
    }
  }

  // 初始化
  Sp.initScrollbar = function () {
    let option = this.watch.option
    let el = this.el
    let skidwayX = this.skidwayX
    let skidwayY = this.skidwayY
    let sliderX = this.sliderX
    let sliderY = this.sliderY
    el.css({'overflow': 'hidden'})
    if (el.css('position') === 'static') {
      el.css({'position': 'relative'})
    }
    // appendChild
    el.append(skidwayX)
    el.append(skidwayY)
    skidwayX.append(sliderX)
    skidwayY.append(sliderY)
    // set style
    skidwayX.css({
      'border-box': 'box-sizing',
      'position': 'absolute',
      'transition': 'width .2s ease, height .2s ease, opacity .2s ease',
      'user-select': 'none',
      'opacity': option.keep ? '1' : '0'
    })
    skidwayY.css({
      'border-box': 'box-sizing',
      'position': 'absolute',
      'transition': 'width .2s ease, height .2s ease, opacity .2s ease',
      'user-select': 'none',
      'opacity': option.keep ? '1' : '0'
    })
    sliderX.css({
      'border-box': 'box-sizing',
      'position': 'absolute'
    })
    sliderY.css({
      'border-box': 'box-sizing',
      'position': 'absolute'
    })

    // 鼠标滚轮监听
    el.on('mousewheel', e => {
      // console.log(e)
      let canScrollX = el[0].scrollWidth - el.innerWidth()
      let canScrollY = el[0].scrollHeight - el.innerHeight()

      this.watch.position = {
        x: math.range(0, canScrollX).in(-option.wheelDistance * e.deltaX + el.scrollLeft()) / canScrollX,
        y: math.range(0, canScrollY).in(-option.wheelDistance * e.deltaY + el.scrollTop()) / canScrollY
      }

      e.preventDefault()
    })

    // 滚动事件监听，可监听 scrollTop scrollLeft
    el.on('scroll', e => {
      this.update('position')
    })

    // 鼠标移出时隐藏滚动条
    el.hover((e) => {
      !option.keep && $(skidwayX).add(skidwayY).css('opacity', 1)
    }, () => {
      !option.keep && $(skidwayX).add(skidwayY).css('opacity', 0)
    })

    // 滚动条拖拽事件监听
    sliderX.on('mousedown', e => {
      let pageX = e.pageX
      let positionX = this.watch.position.x
      let sliderXCanSroll = skidwayX.innerWidth() - sliderX.innerWidth()
      e.stopPropagation()
      // console.log(e)
      $(window).on('mousemove', e => {
        // console.log(e)
        this.setPosition({
          x: math.range().in((e.pageX - pageX) / sliderXCanSroll + positionX)
        })
      })

      $(window).on('mouseup', () => {
        $(window).off('mousemove')
      })
    })

    sliderY.on('mousedown', e => {
      let pageY = e.pageY
      let positionY = this.watch.position.y
      let sliderYCanSroll = skidwayY.innerHeight() - sliderY.innerHeight()
      e.stopPropagation()
      // console.log(e)
      $(window).on('mousemove', e => {
        // console.log(e)
        this.setPosition({
          y: math.range().in((e.pageY - pageY) / sliderYCanSroll + positionY)
        })
      })

      $(window).on('mouseup', () => {
        $(window).off('mousemove')
      })
    })

    // 滚动条hover
    skidwayX.hover(() => {
      skidwayX.css('height', option.widthOnHover)
    }, () => {
      skidwayX.css('height', option.width)
    })

    skidwayY.hover(() => {
      skidwayY.css('width', option.widthOnHover)
    }, () => {
      skidwayY.css('width', option.width)
    })

    // 点击滑道直接到指定位置
    skidwayX.on('mousedown', e => {
      e.stopPropagation()
      this.setPosition({
        x: e.offsetX / skidwayX.innerWidth()
      })
    })

    skidwayY.on('mousedown', e => {
      e.stopPropagation()
      this.setPosition({
        y: e.offsetY / skidwayY.innerHeight()
      })
    })
  }

  // 清除
  Sp.clear = function () {
    let el = this.el
    // let skidwayX = this.skidwayX
    // let skidwayY = this.skidwayY
    let sliderX = this.sliderX
    let sliderY = this.sliderY

    el.off('mousewheel')
    el.off('scroll')
    sliderX.off('mousedown')
    sliderY.off('mousedown')
  }

  // 渲染视图
  Sp.update = function (o = 'all') {
    if (o === 'all') {
      this.updateOption()
      this.updatePosition()
    } else if (o === 'option') {
      this.updateOption()
    } else if (o === 'position') {
      this.updatePosition()
    }
  }

  Sp.updateOption = function () {
    let option = this.watch.option
    let el = this.el
    let skidwayX = this.skidwayX
    let skidwayY = this.skidwayY
    let sliderX = this.sliderX
    let sliderY = this.sliderY

    skidwayX.css(Object.assign({
      'display': option.x ? 'block' : 'none',
      'width': `calc(100% - ${option.y ? option.width : 0}px)`,
      'height': option.width
    }, option.skidwayStyle))

    skidwayY.css(Object.assign({
      'display': option.y ? 'block' : 'none',
      'width': option.width,
      'height': `calc(100% - ${option.x ? option.width : 0}px)`
    }, option.skidwayStyle))

    sliderX.css(Object.assign({
      'display': el.innerWidth() < el[0].scrollWidth ? 'block' : 'none',
      'width': `${el.innerWidth() / el[0].scrollWidth * 100}%`,
      'height': '100%'
    }, option.sliderStyle))

    sliderY.css(Object.assign({
      'display': el.innerHeight() < el[0].scrollHeight ? 'block' : 'none',
      'width': '100%',
      'height': `${el.innerHeight() / el[0].scrollHeight * 100}%`
    }, option.sliderStyle))
  }

  Sp.updatePosition = function () {
    // let option = this.watch.option
    let position = this.watch.position
    let el = this.el
    let skidwayX = this.skidwayX
    let skidwayY = this.skidwayY
    let sliderX = this.sliderX
    let sliderY = this.sliderY

    skidwayX.css({
      'bottom': -el.scrollTop(),
      'left': el.scrollLeft()
    })

    skidwayY.css({
      'top': el.scrollTop(),
      'right': -el.scrollLeft()
    })

    sliderX.css({
      'left': (skidwayX.innerWidth() - sliderX.innerWidth()) * position.x
    })

    sliderY.css({
      'top': (skidwayY.innerHeight() - sliderY.innerHeight()) * position.y
    })

    el.scrollLeft((el[0].scrollWidth - el.innerWidth()) * position.x)
    el.scrollTop((el[0].scrollHeight - el.innerHeight()) * position.y)
  }
})(Scrollbar.prototype)

// vue.use 注册全局自定义指令
const vueScrollbarDirective = function (vm, option) {
  Object.assign(Scrollbar.prototype.initOptions, option)

  vm.directive('scrollbar', {
    bind (el, binding, vnode, oldVnode) {

    },
    inserted (el, binding, vnode, oldVnode) {
      // console.log(el, binding, vnode, oldVnode)
      el.scrollbar = new Scrollbar(el, binding.value)
      // console.log(el.scrollbar)
      // el.scrollbar.setOption({ bbb: 333 })
    },
    componentUpdated (el) {
      // console.log('componentUpdated', el)
      el.scrollbar.update()
    },
    update (el) {
      // console.log('update', el)
      el.scrollbar.update()
    },
    unbind (el) {
      // console.log('unbind', el)
      el.scrollbar.clear()
      el.scrollbar = null
    }
  })
}

export default vueScrollbarDirective
