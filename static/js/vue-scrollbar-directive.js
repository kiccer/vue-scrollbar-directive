import lodash from 'lodash'
import $ from 'jquery'
import 'jquery-mousewheel'
import elementResizeDetector from 'element-resize-detector'
import math from '@catnap/math.js'

let erd = elementResizeDetector({ strategy: 'scroll' }) // 监听元素大小改变方法，基于 scroll 策略

// scrollbar 构造函数
const Scrollbar = function (el, option) {
  let that = this
  this.el = $(el) // 需要添加scrollbar的容器
  this.id = this.getId() // 获取唯一 id
  this.el.attr(this.id, '')
  // 创建元素
  this.skidwayX = $('<div class="skidwayX">') // 横向滚动条滑道
  this.skidwayY = $('<div class="skidwayY">') // 纵向滚动条滑道
  this.sliderX = $('<div class="sliderX">') // 横向滚动条滑块
  this.sliderY = $('<div class="sliderY">') // 纵向滚动条滑块
  // 监听对象
  this.watch = {
    // 最终生效配置
    _option: lodash.merge({}, this.initOptions, option),
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
  // 将实例挂载到元素上
  this.el.scrollbar = this
  // 初始化
  this.initScrollbar()
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
    this.watch.option = lodash.merge({}, this.watch.option, obj)
  }

  // 设置 position
  Sp.setPosition = function (obj) {
    this.watch.position = lodash.merge({}, this.watch.position, obj)
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
    // 滑道样式，使用 css 样式
    skidwayStyle: {
      'background-color': '#F1F1F1'
    },
    // 滑块样式，使用 css 样式
    sliderStyle: {
      'background-color': '#C1C1C1'
    },
    // 悬浮时样式
    hover: {
      skidwayStyle: {},
      sliderStyle: {}
    },
    // 按下时样式
    active: {
      skidwayStyle: {},
      sliderStyle: {}
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
    // appendChild
    el.append(skidwayX)
    el.append(skidwayY)
    skidwayX.append(sliderX)
    skidwayY.append(sliderY)

    // resize
    erd.listenTo(el[0], elem => {
      this.update()
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
      sliderX.addClass('active')
      e.stopPropagation()
      // console.log(e)
      $(window).on('mousemove', e => {
        // console.log(e)
        this.setPosition({
          x: math.range().in((e.pageX - pageX) / sliderXCanSroll + positionX)
        })
      })

      $(window).on('mouseup', () => {
        sliderX.removeClass('active')
        $(window).off('mousemove')
      })
    })

    sliderY.on('mousedown', e => {
      let pageY = e.pageY
      let positionY = this.watch.position.y
      let sliderYCanSroll = skidwayY.innerHeight() - sliderY.innerHeight()
      sliderY.addClass('active')
      e.stopPropagation()
      // console.log(e)
      $(window).on('mousemove', e => {
        // console.log(e)
        this.setPosition({
          y: math.range().in((e.pageY - pageY) / sliderYCanSroll + positionY)
        })
      })

      $(window).on('mouseup', () => {
        sliderY.removeClass('active')
        $(window).off('mousemove')
      })
    })

    // 滚动条hover
    skidwayX.hover(() => {
      skidwayX.css({ 'height': option.widthOnHover })
      skidwayX.addClass('hover')
    }, () => {
      skidwayX.css({ 'height': option.width })
      skidwayX.removeClass('hover')
    })

    skidwayY.hover(() => {
      skidwayY.css({ 'width': option.widthOnHover })
      skidwayY.addClass('hover')
    }, () => {
      skidwayY.css({ 'width': option.width })
      skidwayY.removeClass('hover')
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

    erd.uninstall(el[0])
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

    let elQuery = `${el[0].tagName.toLowerCase()}[${this.id}]`
    let skidwayBaseStyle = Object.keys(option.skidwayStyle).map(n => n + ': ' + option.skidwayStyle[n] + ';').join('\n')
    let sliderBaseStyle = Object.keys(option.sliderStyle).map(n => n + ': ' + option.sliderStyle[n] + ';').join('\n')
    let skidwayHoverStyle = Object.keys(option.hover.skidwayStyle).map(n => n + ': ' + option.hover.skidwayStyle[n] + ';').join('\n')
    let sliderHoverStyle = Object.keys(option.hover.sliderStyle).map(n => n + ': ' + option.hover.sliderStyle[n] + ';').join('\n')
    let skidwayActiveStyle = Object.keys(option.active.skidwayStyle).map(n => n + ': ' + option.active.skidwayStyle[n] + ';').join('\n')
    let sliderActiveStyle = Object.keys(option.active.sliderStyle).map(n => n + ': ' + option.active.sliderStyle[n] + ';').join('\n')

    $(document.head).append(`
      <style type="text/css">
        ${elQuery} {
          overflow: hidden;
          position: ${el.css('position') === 'static' ? 'relative' : el.css('position')};
        }
        ${elQuery} > .skidwayX {
          display: ${option.x ? 'block' : 'none'};
          width: calc(100% - ${option.y ? option.width : 0}px);
          height: ${option.width}px;
          border-box: box-sizing;
          position: absolute;
          transition: all .2s ease, top 0s, left 0s, right 0s, bottom 0s;
          user-select: none;
          opacity: ${option.keep ? '1' : '0'};
          ${skidwayBaseStyle}
        }
        ${elQuery} > .skidwayX.hover {
          ${skidwayHoverStyle}
        }
        ${elQuery} > .skidwayX.active {
          ${skidwayActiveStyle}
        }
        ${elQuery} > .skidwayY {
          display: ${option.y ? 'block' : 'none'};
          width: ${option.width}px;
          height: calc(100% - ${option.x ? option.width : 0}px);
          border-box: box-sizing;
          position: absolute;
          transition: all .2s ease, top 0s, left 0s, right 0s, bottom 0s;
          user-select: none;
          opacity: ${option.keep ? '1' : '0'};
          ${skidwayBaseStyle}
        }
        ${elQuery} > .skidwayY.hover {
          ${skidwayHoverStyle}
        }
        ${elQuery} > .skidwayY.active {
          ${skidwayActiveStyle}
        }
        ${elQuery} > .skidwayX > .sliderX {
          display: ${el.innerWidth() < el[0].scrollWidth ? 'block' : 'none'};
          width: ${el.innerWidth() / el[0].scrollWidth * 100}%;
          height: 100%;
          border-box: box-sizing;
          position: absolute;
          ${sliderBaseStyle}
        }
        ${elQuery} > .skidwayX.hover > .sliderX {
          ${sliderHoverStyle}
        }
        ${elQuery} > .skidwayX > .sliderX.active {
          ${sliderActiveStyle}
        }
        ${elQuery} > .skidwayY > .sliderY {
          display: ${el.innerHeight() < el[0].scrollHeight ? 'block' : 'none'};
          width: 100%;
          height: ${el.innerHeight() / el[0].scrollHeight * 100}%;
          border-box: box-sizing;
          position: absolute;
          ${sliderBaseStyle}
        }
        ${elQuery} > .skidwayY.hover > .sliderY {
          ${sliderHoverStyle}
        }
        ${elQuery} > .skidwayY > .sliderY.active {
          ${sliderActiveStyle}
        }
      </style>
    `)
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
      'left': el.scrollLeft(),
      'top': 'auto',
      'right': 'auto'
    })

    skidwayY.css({
      'top': el.scrollTop(),
      'right': -el.scrollLeft(),
      'bottom': 'auto',
      'left': 'auto'
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
