import { createApp } from "vue";
import Loading from "../../components/loading/index.vue";

export const customLoading = {
  mounted(el, bindings) {
    const app = createApp(Loading);
    console.log(Loading);
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    if (bindings.value) {
      appendEl(el)
    }
  },
  updated(el, bindings) {
    if (bindings.value !== bindings.oldValue) {
      bindings.value ? appendEl(el) : removeEl(el)
    }
  },
}

let position = ''

const appendEl = el => {
  position = el.style.position
  el.style.position = 'relative'
  el?.appendChild(el.instance.$el)
}

const removeEl = el => {
  el.style.position = position
  let $el = el.instance.$el
  if (el?.contains($el)) {
    el?.removeChild($el)
  }
}