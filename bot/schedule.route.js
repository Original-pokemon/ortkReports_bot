module.exports = async function scheduleRoute(
  schedule,
  startScedulePanelService,
  stopScedulePanelService,
  cleanerFolderService,
  variablesRepository
) {
  const startTime = await variablesRepository.getVariable('startTime')
  const stopTime = await variablesRepository.getVariable('stopTime')
  const cleanerTime = await variablesRepository.getVariable('cleanerTime')

  schedule.scheduleJob(startTime, function () {
    startScedulePanelService()
  })
  schedule.scheduleJob(stopTime, function () {
    stopScedulePanelService()
  })
  schedule.scheduleJob(cleanerTime, function () {
    cleanerFolderService()
  })
}

//Надо создать еще одну функцию
