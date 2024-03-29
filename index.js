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

const router = new Router((ctx) => ctx.session.scene)

const authMiddleware = require('./middlewares/auth.mw')
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
const { VariablesRepository } = require('./repositories/variables.repository')

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
  cleanerFolderService,
} = require('./services/schedule.service')

mongoose.connect(config.MONGODB_CONNECTION_STRING)

bot.use(authMiddleware(new UsersRepository(), new FoldersRepository()))

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
    new VariablesRepository(),
    new UsersRepository(),
    new FoldersRepository()
  ),
  cleanerFolderService(
    new UsersRepository(),
    new FoldersRepository(),
    new VariablesRepository()
  ),
  new VariablesRepository()
)

reportsRoute(
  bot,
  mainReportsService(),
  sendDateService(),
  sendReportsService(),
  downloadPhotoServise(
    bot,
    new FoldersRepository(),
    new UsersRepository(),
    new VariablesRepository()
  )
)

bot.catch((err) => errorHandlerService(err))

console.log('Bot started')

bot.start()
