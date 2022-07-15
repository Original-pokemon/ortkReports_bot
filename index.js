const schedule = require('node-schedule')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const { Bot } = require('grammy')
const { Router } = require('@grammyjs/router')
const { hydrateFiles } = require('@grammyjs/files')
const { session } = require('grammy')

dotenv.config()
const config = process.env
const bot = new Bot(config.BOT_TOKEN)

const authMiddleware = require('./middlewares/auth.mw')
const router = new Router((ctx) => ctx.session.scene)
const responseTimeMiddleware = require('./middlewares/responseTime.mw')

bot.use(responseTimeMiddleware)

bot.api.config.use(hydrateFiles(bot.token))

bot.use(
  session({
    initial: () => ({
      scene: '',
      isAdmin: false,
      user: {},
      isTopAdmin: false,
      customData: {},
    }),
  })
)
bot.use(router)

const { FoldersRepository } = require('./repositories/folders.repository')
const { UsersRepository } = require('./repositories/users.repository')

const { getVariables } = require('./services/variables.service')

const { errorHandlerService } = require('./services/errorHandler.service')

const startRoute = require('./bot/start.route')
const startService = require('./services/start.service')

const adminRoute = require('./bot/admin.route')
const {
  adminService,
  adminPanelService,
  userSearchService,
  userProfileService,
  userBanService,
  userPromoteService,
} = require('./services/admin.service')

const reportsRoute = require('./bot/reports.route')
const {
  mainReportsService,
  sendReportsService,
  sendDateService,
  downloadPhotoServise,
} = require('./services/reports.service')

const scheduleRoute = require('./bot/schedule.route')
const {
  stopScedulePanelServise,
  startScedulePanelService,
  cleanerFolderSevrvice,
} = require('./services/schedule.service')

mongoose.connect(config.MONGODB_CONNECTION_STRING)

bot.use(authMiddleware(new UsersRepository()))

startRoute(bot, startService(new UsersRepository()))
adminRoute(
  bot,
  router,
  adminService(),
  adminPanelService(),
  userSearchService,
  userProfileService(new UsersRepository()),
  userBanService(new UsersRepository()),
  userPromoteService(new UsersRepository())
)
scheduleRoute(
  schedule,
  startScedulePanelService(bot, new UsersRepository()),
  stopScedulePanelServise(
    bot,
    getVariables('./config.txt', 'FILE_COUNTER'),
    new UsersRepository(),
    new FoldersRepository()
  ),
  cleanerFolderSevrvice(
    new UsersRepository(),
    new FoldersRepository(),
    getVariables('./config.txt', 'FOLDER_CLEANER_TIME'),
    getVariables('./config.txt', 'ROOT_PATH')
  ),
  getVariables('./config.txt', 'START_TIME'),
  getVariables('./config.txt', 'STOP_TIME'),
)
reportsRoute(
  bot,
  mainReportsService(getVariables('./config.txt', 'ROOT_PATH')),
  sendDateService(getVariables('./config.txt', 'ROOT_PATH')),
  sendReportsService(getVariables('./config.txt', 'ROOT_PATH')),
  downloadPhotoServise(
    bot,
    new FoldersRepository(),
    new UsersRepository(),
    getVariables('./config.txt', 'ROOT_PATH'),
    getVariables('./config.txt', 'FILE_COUNTER'),
    getVariables('./config.txt', 'PHOTO_LIMIT')
  )
)
bot.catch((err) => errorHandlerService(err))
bot.start()
