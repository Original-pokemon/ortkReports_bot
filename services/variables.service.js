async function checkVariables(variablesRepository) {
  const result = await variablesRepository.getVariables()
  if (!result.length) {
    await variablesRepository.createVariables()
  }
}

module.exports = {
  checkVariables,
}
