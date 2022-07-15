const { rename } = require('fs')

module.exports = function authMiddleware(
  userRepository,
  folderRepository,
  rootPath
) {
  return async function (ctx, next) {
    const userId = ctx.chat.id
    const userLogin = ctx.chat?.username
    const userName = userLogin
      ? userLogin
      : ctx.chat.first_name + ctx.chat?.last_name
      ? ''
      : ctx.chat?.last_name
    const newName = userName

    let user = await userRepository.getUser({ telegramId: userId })
    ctx.session.user = user
    if (!user) {
      user = await userRepository.createUser({
        telegramId: userId,
        telegramName: userName,
      })
    }
    const folder = await folderRepository.getFolder({
      attachedToUserId: user.uuid,
    })
    const oldName = user.telegramName

    if (user.userGroup == 'banned')
      return ctx.reply(
        `Вы забанены! По вопросам пишите администратору: ${process.env.CONTACT_ADDRESS}`
      )

    if (user.userGroup == 'admin') ctx.session.isAdmin = true
    else ctx.session.isAdmin = false
    if (process.env.MAIN_ADMIN_ID == userId) ctx.session.isTopAdmin = true

    rename(rootPath + oldName, rootPath + newName, (err) => {
      if (err) {
        throw err
      }
    })

    await userRepository.updateUser(user.uuid, {
      telegramName: userName,
      telegramId: userId,
    })

    await next()
  }
}
