const variablesModel = require('../models/variables.model')
class VariablesRepository {
  async createVariables(data) {
    const result = await variablesModel.create(data)
    return result
  }
  async getVariables() {
    const variablesData = await variablesModel.find().exec()
    return variablesData
  }
}

module.exports.VariablesRepository = VariablesRepository
