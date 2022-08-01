module.exports = function (
  botInstance,
  main,
  sendDate,
  sendReports,
  downloadPhoto
) {
  botInstance.callbackQuery('reports', main)
  botInstance.callbackQuery(/date_[\wа-яА-Я\d]+/g, sendDate)
  botInstance.callbackQuery(/reports_[\wа-яА-Я\d]+\\\d+-\d-\d+/g, sendReports)

  botInstance.on(':photo', downloadPhoto)
}
