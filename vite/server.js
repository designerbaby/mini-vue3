

const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const app = new Koa()

function rewriteImport(content){
  // 目的是改造.js文件内容， 不是/ ./ ../开头的import，替换成/@modules/开头的
  return content.replace(/ from ['|"]([^'"]+)['|"]/g,function(s0,s1){
    if(s1[0]!=='.'&&s1[1]!=='/'){
      return ` from '/@modules/${s1}'`
    }else{
      return s0
    }
  })
}
app.use(ctx => {
  const { request: { url, query } } = ctx
  if (url === "/") {
    // 访问根目录 渲染我们的index.html
    // egg是基于koa开发的
    let content = fs.readFileSync('./index.html', 'utf-8')
    content = content.replace('<script', `
      <script>
        // 注入一个socket客户端
        // 后端的文件变了，通知前端去更新
        window.process = {
          env: {NODE_EV:'dev'}
        }
      </script>
      <script
    
    `)
    ctx.type="text/html"
    ctx.body = content
  }else if(url.endsWith('.css')){
    // 你还可以支持less ，sass ，stylus
    // 或者.ts, 乱遭的 都可以
    const p = path.resolve(__dirname, url.slice(1))
    const file = fs.readFileSync(p,'utf-8')
    const content = `
      const css = "${file.replace(/\n/g,'')}"
      const link = document.createElement('style')
      link.setAttribute('type', 'text/css')
      document.head.appendChild(link)
      link.innerHTML = css
      export default css
    `
    ctx.type = 'application/javascript'
    ctx.body = content
  }else if(url.endsWith('.js')){
    const p = path.resolve(__dirname,url.slice(1))
    ctx.type = 'application/javascript'
    const content = fs.readFileSync(p,'utf-8')
    ctx.body = rewriteImport(content)
  }else if(url.startsWith("/@modules/")){
    // 这个模块，不是本地文件，而是node_module里查找
    const prefix = path.resolve(__dirname, 'node_modules',url.replace('/@modules/',''))
    const module = require(prefix+'/package.json').module
    const p = path.resolve(prefix,module)
    const ret = fs.readFileSync(p,'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(ret)
  }else if(url.indexOf('.vue')>-1){
    // import xx from 'xx.vue'
    // 1. 单文件组件解析
    const p = path.resolve(__dirname, url.split('?')[0].slice(1))
    // 解析单文佳年组建，需要官方的库
    const { descriptor } = compilerSfc.parse(fs.readFileSync(p,'utf-8'))
    if(!query.type){
      // js内容
      ctx.type = 'application/javascript'
      ctx.body = `
${rewriteImport(descriptor.script.content.replace('export default ','const __script = '))}
import {render as __render} from "${url}?type=template"
__script.render = __render
export default __script
      `
    }else if(query.type=="template"){
      // 解析我们的template 编程render函数
      const template = descriptor.template
      const render = compilerDom.compile(template.content, {mode:"module"}).code
      ctx.type = 'application/javascript'
      
      ctx.body = rewriteImport(render)
    }
  }
})

app.listen(9092, () => {
  console.log('listen 9092')
})