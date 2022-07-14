const folderModel = require('../models/folder.model')
class FoldersRepository {
  constructor() {}
  async getFolder(data) {
    const folderData = await folderModel.findOne(data).exec()
    return folderData
  }
  async getFolderCounter(folderId) {
    const folderData = await folderModel
      .findOne({
        uuid: folderId,
      })
      .exec()
    return folderData.counterFiles
  }
  async getFolderByUserId(userId) {
    const folderData = await folderModel
      .find({
        attachedToUserId: userId,
      })
      .exec()
    return folderData
  }
  async createFolder(data) {
    return await folderModel.create({
      attachedToUserId: data.attachedToUserId,
    })
  }

  async editFolder(folderId, data) {
    return await folderModel
      .updateOne(
        { uuid: folderId },
        {
          attachedToUserId: data.userId,
        }
      )
      .exec()
  }
  async deleteFolder(folderId) {
    return await folderModel.deleteOne({ uuid: folderId }).exec()
  }
  async increaseFolderCounter(folderId) {
    return await folderModel
      .updateOne({ uuid: folderId }, { $inc: { counterFiles: 1 } })
      .exec()
  }
  async getFolderByCounter(counterFilter) {
    const now = new Date()
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    )
    const arrFolder = await folderModel
      .find({
        $and: [
          { counterFiles: { $gte: counterFilter } },
          { date: { $gte: date } },
        ],
      })
      .exec()

    return arrFolder
  }
  async getFoldersByDate(date) {
    return folderModel.find({ date: { $lte: date } })
  }
}

module.exports.FoldersRepository = FoldersRepository
