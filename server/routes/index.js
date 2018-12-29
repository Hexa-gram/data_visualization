const router = require('koa-router')();
const fs = require("fs");

router.get('/pie', ctx => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/pies.html');
});

router.get('/bar', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/bar.html');
  // ctx.body = body.split(/[\n]/)[5];
  // await ctx.render("bar")
})

router.get('/table', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/table.html');
  // ctx.body = body.split(/[\n]/)[5];
  // await ctx.render("bar")
})

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router