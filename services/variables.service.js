async function getVariables(variablesRepository, varName) {
  const arr = await variablesRepository.getVariables()
  const obj = arr[0]
  return obj[varName]
}

async function checkVariables(variablesRepository) {
  const result = await variablesRepository.getVariables()
  if (!result.length) {
    try {
      await variablesRepository.createVariables()
    } catch (error) {
      if (error) {
        console.log(error)
      }
    }
  }
}

module.exports = {
  getVariables,
  checkVariables,
}
