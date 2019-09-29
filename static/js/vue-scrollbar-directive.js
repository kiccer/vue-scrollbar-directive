// scrollbar 构造函数
const Scrollbar = function (el, binding, vnode, oldVnode) {
  let that = this
  this.el = el // 需要添加scrollbar的容器
  this.id = this.getId() // 获取唯一 id
  this.scrollbar_x_skidway = document.createElement('div') // 横向滚动条滑道
  this.scrollbar_y_skidway = document.createElement('div') // 纵向滚动条滑道
  this.scrollbar_x_slider = document.createElement('div') // 横向滚动条滑块
  this.scrollbar_y_slider = document.createElement('div') // 纵向滚动条滑块
  // 监听对象
  this.watch = {
    _option: Object.assign({}, this.initOptions, binding.value), // 最终生效配置
    get option () {
      return this._option
    },
    set option (option) {
      this._option = Object.assign({}, this._option, option)
      console.log(that.id + '\'s option has been updated:', this._option)
    }
  }
  // this.option = Object.assign({}, this.initOptions, binding.value)
  this.el.setAttribute(this.id, '')
  // 初始化
  this.initScrollbar()
  // 将实例挂载到元素上
  this.el.scrollbar = this
}

// 构造函数内部方法
;((Sp) => {
  // 唯一下标
  Sp.index = 0

  // 设置 option
  Sp.setOption = function (obj) {
    this.watch.option = obj
  }

  // 获取数据类型
  Sp.type = function (t) {
    return Object.prototype.toString.call(t).slice(8, -1)
  }

  // 获取唯一 id
  Sp.getId = function () {
    return `scrollbar_${Date.now()}_${Sp.index++}`
  }

  // 获取/设置 style
  Sp.style = function (el, style) {
    if (this.type(style) === 'String') {
      return window.getComputedStyle(el, null)[style]
    } else if (this.type(style) === 'Object') {
      style = Object.keys(style).forEach(k => {
        el.style[k] = style[k]
      })
    }
  }

  // 初始化
  Sp.initScrollbar = function () {
    // appendChild
    this.el.appendChild(this.scrollbar_x_skidway)
    this.el.appendChild(this.scrollbar_y_skidway)
    this.scrollbar_x_skidway.appendChild(this.scrollbar_x_slider)
    this.scrollbar_y_skidway.appendChild(this.scrollbar_y_slider)
    // set class
    this.scrollbar_x_skidway.setAttribute('class', 'scrollbar_x_skidway')
    this.scrollbar_y_skidway.setAttribute('class', 'scrollbar_y_skidway')
    this.scrollbar_x_slider.setAttribute('class', 'scrollbar_x_slider')
    this.scrollbar_y_slider.setAttribute('class', 'scrollbar_y_slider')
    // set style
  }

  // 渲染视图
  Sp.update = function () {

  }
})(Scrollbar.prototype)

// vue.use 注册全局自定义指令
const vueScrollbarDirective = function (vm, option) {
  Scrollbar.prototype.initOptions = Object.assign({
    // 默认配置 (完整)
    x: true,
    y: true,
    width: 6,
    radius: 6,
    skidwayStyle: {
      color: '#F1F1F1'
    },
    sliderStyle: {
      color: '#C1C1C1'
    }
  }, option)

  vm.directive('scrollbar', {
    inserted (el, binding, vnode, oldVnode) {
      // console.log(el, binding, vnode, oldVnode)
      el.scrollbar = new Scrollbar(el, binding, vnode, oldVnode)
      // console.log(el.scrollbar)
      // console.log(el.scrollbar.style('overflow-y'))
      // el.scrollbar.setOption({ bbb: 333 })
      el.scrollbar.style(el, {'overflow': 'hidden'})
      if (el.scrollbar.style(el, 'position') === 'static') {
        el.scrollbar.style(el, {'position': 'relative'})
      }
    }
  })
}

export default vueScrollbarDirective
