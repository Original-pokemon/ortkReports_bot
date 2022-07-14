const userModel = require('../models/user.model')

class UsersRepository {
  constructor() {}
  async getUser(data) {
    const user = await userModel.findOne(data).exec()
    return user
  }

  async deleteUser(userId) {
    return await userModel.remove({ uuid: userId }).exec()
  }

  async updateUser(userId, data) {
    return await userModel
      .updateOne(
        { uuid: userId },
        {
          userGroup: data.userGroup,
          userfolderPath: data.userfolderPath,
          telegramName: data.telegramName,
        }
      )
      .exec()
  }

  async createUser(data) {
    return await userModel.create({
      telegramId: data.telegramId,
      telegramName: data.telegramName,
    })
  }
  async getAll() {
    const user = await userModel
      .find({ $or: [{ userGroup: 'admin' }, { userGroup: 'user' }] })
      .exec()
    return user
  }
  async getAdmins() {
    const users = await userModel.find({ userGroup: 'admin' }).exec()
    return users
  }
  async getUsersNameById(idArr) {
    if (idArr.length > 0) {
      const arr = idArr.map((item) => {
        const obj = {
          uuid: item,
        }
        return obj
      })
      const usersArr = await userModel.find({ $and: arr })
      return usersArr.map((item) => item.telegramName)
    }
    return []
  }
}

module.exports.UsersRepository = UsersRepository
