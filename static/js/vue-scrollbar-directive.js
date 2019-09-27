const vueScrollbarDirective = function (vm, options) {
  vm.directive('scrollbar', {
    inserted (el) {
      console.log(el)
    }
  })
}

export default vueScrollbarDirective
