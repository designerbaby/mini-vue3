const fs = require('fs')
const path = require('path')
const Koa = require('koa')

const app = new Koa()

app.use(() => {
  const { request: {url, query }} = ctx
  if (url === '/') {
    // 访问根目录，渲染index.html
    let content = fs.readFileSync('./index.html', 'utf-8')
  }
})
app.listen(9092, () => {
  console.log('listen 9092')
})