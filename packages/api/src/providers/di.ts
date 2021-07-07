import { Express } from 'express'
import { Sequelize } from 'sequelize'
import { Logger } from 'winston'
import OAuthServer from 'express-oauth-server'
import OAuthModel from '../oauth'

export default class DIContainer {
	public readonly app: Express
	public readonly db: Sequelize
	public readonly logger: Logger
	public readonly oauth: OAuthServer

	constructor(
		app: Express,
		logger: Logger,
		db: Sequelize
	) {
		this.app = app
		this.logger = logger
		this.db = db
		this.oauth = new OAuthServer({
			model: new OAuthModel(this),
			useErrorHandler: true
		})
	}
}
