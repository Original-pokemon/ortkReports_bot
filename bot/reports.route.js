module.exports = function (
  botInstance,
  main,
  sendDate,
  sendReports,
  downloadPhoto
) {
  botInstance.callbackQuery('reports', main)
  botInstance.callbackQuery(/date_[a-zA-Z_]+/g, sendDate)
  botInstance.callbackQuery(/reports_\w+\\\d+-\d-\d+/g, sendReports)

  botInstance.on(':photo', downloadPhoto)
}
