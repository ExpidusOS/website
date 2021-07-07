const env = process.env.NODE_ENV || 'development'

const logLevels: Record<string, string> = {
	test: 'error',
	development: 'debug',
	production: 'info'
}

const production = env === 'production'

export default {
	env,
	production,
	openchannel: {
		marketplaceID: process.env.OPENCHANNEL_MARKETPLACE_ID,
		secret: process.env.OPENCHANNEL_SECRET
	},
	clients: [
		{
			id: process.env.EXPIDUS_CLOUD_CLIENT_ID,
			secret: process.env.EXPIDUS_CLOUD_CLIENT_SECRET,
			redirects: ['https://account.expidusos.com/login', 'https://account.expidusos.com/register'],
			grants: ['authorization_code', 'password'],
			perms: ['profile:all']
		}
	],
	database: {
		connection: env === 'test'
			? 'sqlite::memory'
			: `mariadb://expidus:${process.env.DB_PASSWORD}@db/expidus`,
		options: {
			logging: env !== 'test'
		}
	},
	winston: {
		level: logLevels[env]
	}
}
