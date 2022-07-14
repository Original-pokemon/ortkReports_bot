const { InlineKeyboard } = require('grammy')

module.exports = function startService(userRepository) {
  return async function (ctx) {
    const user = await userRepository.getUser({ telegramId: ctx.chat.id })
    let buttons = new InlineKeyboard()
    if (ctx.session.isAdmin || ctx.session.isTopAdmin) {
      buttons = buttons.text('Открыть панель администратора', 'admin').row()
    }
    ctx.reply(
      `Приветствую! Данный бот предазначен для сбора отчетов. Каждый день сюда будут приходить напоминания \n\nВаш UUID: ${user.uuid}`,
      {
        reply_markup: buttons,
      }
    )
  }
}
