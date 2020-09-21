import Koa from 'koa'

const app = new Koa()

app.use(ctx => {

})

app.listen(9092, () => {
  console.log('listen 9092')
})