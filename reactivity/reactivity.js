
// 用map收集所有依赖
// { // targetMap: 
//   target : { // depMap
//     key: [effect] // dep
//   }
// }

let targetMap = new WeakMap()
let effectStack = [] // 存储effect
function track(target, key) {
  // 初始化
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    let depMap = targetMap.get(target)
    if (depMap === undefined) { // 如果内部没有对象,就初始化一个
      depMap = new Map()
      targetMap.set(target, depMap)
    }

    let dep = depMap.get(key)
    if (dep === undefined) { // 如果内部没有deps
      dep = new Set()
      depMap.set(key, dep)
    }

    // 双向缓存
    if (!dep.has(effect)) { // 如果里面没有effect
      dep.add(effect)
      effect.deps.push(dep)
    }
  }
}

function trigger(target, key, info) {
  let depMap = targetMap.get(target)
  if (depMap === undefined) {
    return  // 没有effect
  }
  const effects = new Set()
  const computeds = new Set() // computed是一个特殊的effect

  if (key) {
    let deps = depMap.get(key)
    deps.forEach(effect => {
      if (effect.computed) {
        computeds.add(effect)
      } else {
        effects.add(effect)
      }
    })
  }

  effects.forEach(effect => effect())
  computeds.forEach(computed => computed())
}

const baseHandler = {
  get(target, key) {
    const ret = target[key]
    track(target, key)
    return ret // typeof ret === 'object'? reactive(ret): ret
  },
  set(target, key, value) {
    const info = {
      oldValue: target[key],
      newValue: value
    }
    target[key] = value
    trigger(target, key, info)
  }
}

function reactive(target) {
  // debugger
  const observed = new Proxy(target, baseHandler)
  return observed
}

function computed(fn) {
  const runner = effect(fn, { computed: true, lazy: true })
  return {
    effect: runner,
    get value() {
      return runner()
    }
  }
}

function effect(fn, options = {}) {
  let e = createReactiveEvent(fn, options)
  if (!options.lazy) {
    e()
  }
  return e
}

function createReactiveEvent(fn, options) {
  let effectInner = function effectInner(...args) {
    return run(effectInner, fn, args)
  }
  effectInner.deps = []
  effectInner.computed = options.computed
  effectInner.lazy = options.lazy
  return effectInner
}

function run (aEffect, fn, args) {
  if (effectStack.indexOf(aEffect) === -1) { // 里面没有这个effect
    try {
      effectStack.push(aEffect)
      return fn(...args)
    } finally {
      effectStack.pop()
    }
  }
}
