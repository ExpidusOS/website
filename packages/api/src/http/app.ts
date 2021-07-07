import express from 'express'
import genPublisherRouter from './routes/publisher'
import genUserRouter from './routes/user'
import winston from '../providers/winston'
import DIContainer from '../providers/di'
import { sequelize } from '../database'
import { notFoundHandler, errorHandler } from './middleware/error'

const app = express()
const di = new DIContainer(
	app,
	winston,
	sequelize
)

app.use((req, res, next) => {
	winston.debug(`receving request from ${req.protocol}://${req.hostname}${req.originalUrl} (${req.method})`)
	next()
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/v1/user', genUserRouter(di))
app.use('/v1/publisher', genPublisherRouter(di))
app.use(notFoundHandler)
app.use(errorHandler)

export default app
