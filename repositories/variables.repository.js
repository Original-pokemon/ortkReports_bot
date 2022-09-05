const variablesModel = require('../models/variables.model')
class VariablesRepository {
  constructor() {}
  async createVariables(data) {
    const result = await variablesModel.create(data)
    return result
  }

  async getVariable(varName) {
    const arrVaribles = await variablesModel.find().exec()

    if (arrVaribles.length) {
      const arrVaribles = await variablesModel.find().exec()
      const objVariables = arrVaribles[0]
      return objVariables[varName]
    } else {
      setTimeout(async () => {
        let arrVaribles = await variablesModel.find().exec()
        if (!arrVaribles.length) {
          await variablesModel.create({})
        }

        const objVariables = arrVaribles[0]

        return objVariables[varName]
      }, 5000)
    }
  }
}

module.exports.VariablesRepository = VariablesRepository
