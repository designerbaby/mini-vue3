

// vite源码原理：
1、支持npm包的import
  import xx from 'vue' 转换成 import xxx from '/@moduels/vue'
  koa监听得到/modules/开头的网络请求，就去node_module里查找
2、支持.vue单文件的解析
  将.vue单文件组件，拆成script,template
  template => render函数拼成一个对象
  script.render = render
3、支持import css/热更新/ts支持等
