const { access, open, constants, writeFile, readFile } = require('fs')
const { GrammyError, HttpError } = require('grammy')

function errorHandlerService(err) {
  const now = new Date()
  const e = err.error
  const date =
    `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ` +
    `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `

  access(`${process.env.MAIN_PATH}/errors.txt`, constants.F_OK, (err) => {
    if (err) {
      open(`${process.env.MAIN_PATH}/errors.txt`, 'w', (err) => {
        if (err) throw err
      })
    }
    readFile(
      `${process.env.MAIN_PATH}/errors.txt`,
      'utf8',
      function (error, fileContent) {
        const fileText = fileContent + '\n\n' + date + '\n\t' + e.stack
        writeFile(`${process.env.MAIN_PATH}/errors.txt`, fileText, (err) => {
          if (err) throw err
        })

        if (error) throw error

        if (e instanceof GrammyError) {
          const text = date + `Error in request: ${e.description}`

          console.error(text)
        } else if (e instanceof HttpError) {
          const text = date + `Could not contact Telegram: ${e}`

          console.error(text)
        } else {
          const text = date + `Unknown error: ${e}`

          console.error(text)
        }
      }
    )
  })
}

module.exports = {
  errorHandlerService,
}
