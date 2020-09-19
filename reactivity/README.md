
### 1、作用：
  - reactive: reactive({}) // 可以将对象转换为proxy响应式对象
  - computed(() => {}) // 和vue2中相同，计算属性
  - effect() // 直接去执行
### 2、原理：
  使用es6自带的属性，每个属性有get和set方法，借助es6的proxy,进行拦截。
### 3、思路：
  用map收集所有依赖：
  ```
  { // targetMap: 
    target : { // depMap
      key: [effect] // dep
    }
  }
  ```
