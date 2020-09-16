import { track } from "@vue/reactivity"

let targetMap = new WeakMap()
let effectStack = []
function track(target, key) {
  const effect = effectStack
}
const baseHandler = {
  get(target, key) {
    const ret = target[key]
    track(target, key)
    return ret
  },
  set(target, key, value) {
    const info = {
      oldValue: target[key],
      newValue: value
    }
    target[key] = value
  }
}

function reactive() {
  const observed = new Proxy(target, baseHandler)
  return observed
}

function computed() {

}

function effect() {

}