import { Sequelize } from 'sequelize'
import AccessToken from './models/accesstoken'
import Application from './models/application'
import ApplicationRelease from './models/applicationrelease'
import AuthCode from './models/authcode'
import Client from './models/client'
import Publisher from './models/publisher'
import Staff from './models/staff'
import User from './models/user'
import config from '../config'

export const models = {
	AccessToken,
	AuthCode,
	Client,
	Staff,
	User
}

export const sequelize = new Sequelize(
	config.database.connection,
	config.database.options
)

Object
	.values(models)
	.forEach(model => model.initializeModel(sequelize))
