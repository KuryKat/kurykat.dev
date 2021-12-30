import createError, { HttpError } from 'http-errors'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import helmet from 'helmet'
import lessMiddleware from 'less-middleware'

// IMPORT ROUTES
// import indexRouter from './routes'

import config from './config.json'

const app = express()
const basePath = process.cwd()

// view engine setup
app.set('views', path.join(basePath, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'https:'],
      'script-src': ["'self'", 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
      'frame-src': ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
      'connect-src': ["'self'", 'https://hcaptcha.com', 'https://*.hcaptcha.com']
    }
  },
  hsts: {
    maxAge: 15552000,
    includeSubDomains: true,
    preload: true
  }
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(lessMiddleware('/less', { pathRoot: path.join(basePath, 'static'), dest: '/css', render: { compress: 'true' } }))

app.use(express.static(path.join(basePath, 'static')))

// USE ROUTES
app.get('/', (_req, res) => {
  res.render('index')
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err: HttpError | Error, req: Request, res: Response, _next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status((err as HttpError).status ?? 500)
  res.render('error')
})

export default {
  app,
  config
}
