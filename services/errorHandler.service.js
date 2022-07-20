const { access, open, constants, writeFile, readFile } = require('fs')
const { GrammyError, HttpError } = require('grammy')

function errorHandlerService(err) {
  const date = new Date()
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  access('./log.txt', constants.F_OK, (err) => {
    if (err) {
      open('./log.txt', 'w', (err) => {
        if (err) throw err
      })
    }
  })
  readFile('./log.txt', 'utf8', function (error, fileContent) {
    if (error) throw error

    if (e instanceof GrammyError) {
      const text =
        fileContent +
        '\n' +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ` +
        `Error in request: ${e.description}`
      console.error(text)
      writeFile('./log.txt', text, (err) => {
        if (err) throw err
      })
    } else if (e instanceof HttpError) {
      const text =
        fileContent +
        '\n' +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}  ` +
        `Could not contact Telegram: ${e}`
      console.error(text)
      writeFile('./log.txt', `Could not contact Telegram: ${e}`, (err) => {
        if (err) throw err
      })
    } else {
      const text =
        fileContent +
        '\n' +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ` +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ` +
        `Unknown error: ${e}`
      console.error(text)
      writeFile('./log.txt', text, (err) => {
        if (err) throw err
      })
    }
  })
}

module.exports = {
  errorHandlerService,
}
