const { InlineKeyboard } = require('grammy')
const { access, constants, mkdir, readdirSync } = require('fs')
const { InputFile } = require('grammy')

function mainReportsService() {
  return async function (ctx) {
    const folderPath = `${process.env.MAIN_PATH}/folders`

    access(folderPath, constants.F_OK, async (err) => {
      if (err) {
        mkdir(folderPath, { recursive: true }, (err) => {
          if (err) throw err
        })
      }

      const files = readdirSync(folderPath)

      const markup = new InlineKeyboard()
      files.forEach((item) => {
        markup.text(item, `date_${item}`).row()
      })
      markup.text('Назад', 'admin')

      return await ctx.editMessageText(
        'Выберете пользователя, чьи отчеты Вас интересуют',
        {
          reply_markup: markup,
        }
      )
    })
  }
}
// эта функция фильтрует пользователей больше 5 отчетов или меньше

function sendDateService() {
  return async function (ctx) {
    const callBackArr = ctx.update.callback_query.data.split(/date_+/g)
    const folderPath = `${process.env.MAIN_PATH}/folders/${callBackArr[1]}`
    const files = readdirSync(folderPath)
    const markup = new InlineKeyboard()

    files.forEach((item) => {
      markup.text(item, `reports_${callBackArr[1]}/${item}`).row()
    })
    markup.text('Назад', 'reports')

    return await ctx.editMessageText(`Выберете дату, которая Вас интересует`, {
      reply_markup: markup,
    })
  }
}

function sendReportsService() {
  return async function (ctx) {
    const callBackArr = ctx.update.callback_query.data.split(/reports_+/g)
    const folderPath = `${process.env.MAIN_PATH}/folders/${callBackArr[1]}`
    const files = readdirSync(folderPath)
    const filePathArr = files.map((item) => {
      return { type: 'photo', media: new InputFile(folderPath + '/' + item) }
    })
    await ctx.replyWithMediaGroup(filePathArr)
  }
}

function downloadPhotoServise(
  botInstance,
  folderRepository,
  userRepositoty,
  variablesRepository
) {
  return async (ctx) => {
    const photoLimit = await variablesRepository.getVariable('photoLimit')
    const fileCounter = await variablesRepository.getVariable('fileCounter')

    console.log(photoLimit, fileCounter)

    const chatId = ctx.msg.chat.id
    const user = await userRepositoty.getUser({ telegramId: chatId })
    const userName = user.telegramName
    const date = new Date()
    const folderDir = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`
    const folderPath = `${process.env.MAIN_PATH}/folders/${userName}/${folderDir}/`

    let folder

    access(folderPath, constants.F_OK, async (err) => {
      if (err) {
        mkdir(folderPath, { recursive: true }, (err) => {
          if (err) throw err
        })
        folder = await folderRepository.createFolder({
          attachedToUserId: user.uuid,
        })
      }
    })
    if (folder === undefined) {
      folder = await folderRepository.getFolder({
        $and: [{ attachedToUserId: user.uuid }, { path: folderDir }],
      })
    }

    const file = await ctx.getFile()
    if (folder.counterFiles >= +photoLimit) {
      return
    }
    await file.download(folderPath + getRandomFileName() + '.jpg')
    await folderRepository.increaseFolderCounter(folder.uuid)
    const folderCounter = await folderRepository.getFolderCounter(folder.uuid)
    const text =
      folderCounter < +fileCounter
        ? `Осталось отправить ${+fileCounter - folderCounter} отчет(а)`
        : 'На сегодня все отчеты приняты!'

    await botInstance.api.sendMessage(chatId, text)

    function getRandomFileName() {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
      const random = ('' + Math.random()).substring(2, 8)
      const random_number = timestamp + random
      return random_number
    }
  }
}

module.exports = {
  mainReportsService,
  sendDateService,
  sendReportsService,
  downloadPhotoServise,
}
