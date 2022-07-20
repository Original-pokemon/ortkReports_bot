const {
  accessSync,
  openSync,
  constants,
  writeFileSync,
  readFileSync,
} = require('fs')

function getVariables(path, varName) {
  const text =
    'ROOT_PATH=С:\\bot\\\n' +
    'START_TIME=0 10 * * *\n' +
    'STOP_TIME=30 19 * * *\n' +
    'FOLDER_CLEANER_TIME=14\n' +
    'FILE_COUNTER=5\n' +
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
