module.exports = function scheduleRoute(
  schedule,
  startScedulePanelService,
  stopScedulePanelService,
  cleanerFolderService,
  startTime,
  stopTime,
  cleanerTime
) {
  schedule.scheduleJob(startTime, function () {
    startScedulePanelService()
  })
  schedule.scheduleJob(stopTime, function () {
    stopScedulePanelService()
  })
  schedule.scheduleJob('* * * * * 7', function () {
    cleanerFolderService()
  })
}

//Надо создать еще одну функцию
