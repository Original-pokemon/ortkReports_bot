module.exports = async function responseTimeMiddleware(ctx, next) {
  const date = new Date()
  const before = Date.now() // milliseconds
  // invoke downstream middleware
  await next() // make sure to `await`!
  // take time after
  const after = Date.now() // milliseconds
  // log difference
  console.log(
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    `Response time: ${after - before} ms`,
    ctx.update.callback_query.data ? ctx.update.callback_query.data : null
  )
}
