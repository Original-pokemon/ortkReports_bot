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
  checkVariables,
}
