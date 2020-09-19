#### 1、vite源码原理：
import xx from './a.js'，浏览器会发出一个网络请求。vite拦截这个请求，去做vue相关的编译，解析等，实现了按需加载的能力，不用打包，dev秒开，build走的是rollup。
#### 2、vite源码实现：

- 1、支持npm包的import
  import xx from 'vue' 转换成 import xxx from '/@moduels/vue'
  koa监听得到/@moduels/开头的网络请求，就去node_module里查找
- 2、支持.vue单文件组件的解析
  将.vue单文件组件，拆成script,template
  template => render函数拼成一个对象
  script.render = render
- 3、支持import css/热更新/ts支持等
