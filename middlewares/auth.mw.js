const { rename } = require('fs')

module.exports = function authMiddleware(userRepository, folderRepository) {
  return async function (ctx, next) {
    const userId = ctx.chat.id
    const userLogin = ctx.chat.username
    const first_name = ctx.chat.first_name
    const last_name = ctx.chat.last_name ? `_${ctx.chat.last_name}` : ''
    const userName = userLogin
      ? userLogin
      : first_name
          .split('')
          .filter((item) => item !== ' ')
          .join('') + last_name
    console.log(userName)
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

    rename(
      process.env.ROOT_PATH + oldName,
      process.env.ROOT_PATH + userName,
      (err) => {
        if (err) {
        }
      }
    )

    await userRepository.updateUser(user.uuid, {
      telegramName: userName,
      telegramId: userId,
    })

    await next()
  }
}
