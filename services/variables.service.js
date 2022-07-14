const { access, open, constants, writeFile, readFileSync } = require('fs')

function getVariables(path, varName) {
  const text =
    'ROOT_PATH=С:\\bot\\\n' +
    'START_TIME=00 10 * * *\n' +
    'STOP_TIME=30 19 * * *\n' +
    'FOLDER_CLEANER_TIME=14\n' +
    'FILE_COUNTER=5\n' +
    'PHOTO_LIMIT=10'

  access(path, constants.F_OK, (err) => {
    if (err) {
      open(path, 'w', (err) => {
        if (err) throw err
      })
      writeFile(path, text, (err) => {
        if (err) throw err
      })
    }
  })

  const data = readFileSync(path, 'utf8')
  const arr = data.split('\n')
  const dataArr = arr.map((item) => item.split('=')).flat()
  const indexElem = dataArr.findIndex((item) => item === varName) + 1
  // console.log(1, dataArr[indexElem])
  return dataArr[indexElem]
}

module.exports = {
  getVariables,
}
