let Vue
const install = (_Vue, options = {}) => {
  Vue = _Vue
  Vue.directive('back', {
    inserted (el, bindings) {
      const scrollPosition = calculation(bindings.value)
      const { el: selector, duration = 300, distance = 0, interval = 10 } = options
      let eventTarget = window
      let scrollContainer = document.documentElement
      if (selector) {
        const wrapper = document.querySelector(selector)
        if (wrapper) {
          eventTarget = wrapper
          scrollContainer = wrapper
        }
      }
      const appearancePosition = calculation(distance)
      const handleScroll = () => {
        el.style.display = scrollContainer.scrollTop >= appearancePosition ? 'block' : 'none'
      }
      handleScroll()
      eventTarget.addEventListener('scroll', handleScroll)
      el.addEventListener('click', function () {
        if (this.isScroll) return
        this.isScroll = true
        eventTarget.removeEventListener('scroll', handleScroll)
        const distance = scrollContainer.scrollTop
        const step = (distance / duration) * interval
        const timer = setInterval(() => {
          let curTop = scrollContainer.scrollTop
          curTop -= step
          if (curTop <= scrollPosition) {
            clearInterval(timer)
            scrollContainer.scrollTop = scrollPosition
            eventTarget.addEventListener('scroll', handleScroll)
            this.isScroll = false
            return
          }
          scrollContainer.scrollTop = curTop
        }, interval)
      })
    }
  })
}

function calculation (num = 0) {
  const reg = /^(\d+)(px|page)?$/
  let res = 0
  if (reg.test(num)) {
    const [, count, unit = 'px'] = reg.exec(num)
    if (unit === 'px') {
      res = count
    } else if (unit === 'page') {
      res = count * document.documentElement.clientHeight
    }
  }
  return res
}

export default {
  install
}
