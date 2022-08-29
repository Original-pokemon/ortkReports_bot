const variablesModel = require('../models/variables.model')
class VariablesRepository {
  constructor() {}
  async createVariables(data) {
    const result = await variablesModel.create(data)
    return result
  }
  async getVariables() {
    const variablesData = await variablesModel.find().exec()
    return variablesData
  }
  async getVariable(varName) {
    const arrVaribles = await variablesModel.find().exec()
    const objVariables = arrVaribles[0]
    return objVariables[varName]
  }
}

module.exports.VariablesRepository = VariablesRepository
