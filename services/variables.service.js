const {
  accessSync,
  openSync,
  constants,
  writeFileSync,
  readFileSync,
} = require('fs')

function getVariables(path, varName) {
  const text =
    'ROOT_PATH=С:\\bot\\\r\n' +
    'START_TIME=0 10 * * *\r\n' +
    'STOP_TIME=30 19 * * *\r\n' +
    'FOLDER_CLEANER_TIME=14\r\n' +
    'FILE_COUNTER=5\r\n' +
    'PHOTO_LIMIT=10'

  try {
    accessSync(path, constants.F_OK)
  } catch (err) {
    openSync(path, 'w')
    writeFileSync(path, text)
  }

  const data = readFileSync(path, 'utf8')
  const arr = data.split('\n')
  const dataArr = arr
    .map((item) => {
      item = item.replace('\r', '')
      return item.split('=')
    })
    .flat()
  const indexElem = dataArr.findIndex((item) => item === varName) + 1
  // console.log(1, dataArr[indexElem])
  return dataArr[indexElem]
}

module.exports = {
  getVariables,
}
