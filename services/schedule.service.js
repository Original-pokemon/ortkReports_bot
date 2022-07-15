const { InlineKeyboard } = require('grammy')
const { readdir, rmdir, unlink, access, constants } = require('fs')

function stopScedulePanelServise(
  botInstance,
  fileCounter,
  userRepositoty,
  folderRepositoty
) {
  return async function () {
    const arrUsers = await userRepositoty.getAdmins()
    const arrTgId = arrUsers.map((item) => item.telegramId)
    const arr = await getArrUserNameByFolders()

    let msg

    if (arr.length > 0) {
      const firstPart = await getArrUserNameByFolders('full')
      const secondPart = diff(firstPart, await getArrUserNameByFolders())

      msg =
        `Сегодня скинул(и) ${fileCounter} отчетов :\n${firstPart.join(
          ',\n'
        )}\n` + `Скинули, но МЕНЬШЕ ${fileCounter}:\n${secondPart.join(',\n')}`
    } else {
      msg = `Сегодня отчеты никто не скинул`
    }
    arrTgId.forEach((item) => {
      botInstance.api.sendMessage(item, msg, {
        reply_markup: new InlineKeyboard().text('Посмотреть отчеты', 'reports'),
      })
    })
    async function getArrUserNameByFolders(condition) {
      let arrFolder
      if (condition === 'full') {
        arrFolder = await folderRepositoty.getFolderByCounter(
          fileCounter,
          new Date()
        )
      } else {
        arrFolder = await folderRepositoty.getFolderByCounter(1, new Date())
      }

      const arrUserId = arrFolder.map((item) => item.attachedToUserId)
      const arrUsersName = await userRepositoty.getUsersNameArrById(arrUserId)
      // console.log(arrUsersName, 'arrUsersName')
      return arrUsersName
    }
    function diff(a1, a2) {
      return a1
        .filter((i) => !a2.includes(i))
        .concat(a2.filter((i) => !a1.includes(i)))
    }
  }
}

function startScedulePanelService(botInstance, userRepositoty) {
  return async function () {
    const arrUsers = await userRepositoty.getAll()

    const arrTgId = arrUsers.map((item) => item.telegramId)

    arrTgId.forEach((item) => {
      botInstance.api.sendMessage(item, `Пришло время отправлять отчеты!`)
    })
  }
}

function cleanerFolderSevrvice(
  userRepositoty,
  folderRepositoty,
  cleanerTime,
  rootPath
) {
  return async function () {
    const now = new Date()
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    )

    const foldersArr = await folderRepositoty.getFoldersByDate(
      date - cleanerTime * 24 * 3600 * 1000
    )
    if (foldersArr.length > 0) {
      foldersArr.forEach(async (item) => {
        const folderPath = item.path
        const user = await userRepositoty.getUser({
          uuid: item.attachedToUserId,
        })
        const userPath = user.telegramName
        const path = `${rootPath}${userPath}\\${folderPath}\\`
        await listObjects(path)
        await folderRepositoty.deleteFolder(item.uuid)
        console.log('Удалена папка: ' + path)
      })
    }

    async function listObjects(path) {
      access(path, constants.F_OK, async (err) => {
        if (err) {
          return
        }
        rmdir(path, (err) => {
          if (err) {
            readdir(path, (err, files) => {
              if (err) throw err

              for (let file of files) {
                unlink(path + file, (err) => {
                  if (err) throw err
                })
              }
            })
          }
          listObjects(path)
        })
      })
    }
  }
}

module.exports = {
  startScedulePanelService,
  stopScedulePanelServise,
  cleanerFolderSevrvice,
}
