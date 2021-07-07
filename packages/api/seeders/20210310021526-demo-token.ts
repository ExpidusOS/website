import { Seeder } from '../src/umzug'

export const up: Seeder = async ({ context: sequelize }) => {
	const expires = new Date()
	expires.setHours(expires.getHours() + 1)
	await sequelize.getQueryInterface().bulkInsert('accessTokens', [{
		token: 'dummy_token',
		uuid: 'd95f83f7-d40f-4071-b650-a98e03e368c2',
		expires,
		scope: 'password',
		client_id: '5482801f-c2c1-4a5e-86df-d99c3bcca197',
		createdAt: new Date(),
		updatedAt: new Date()
	}])
}

export const down: Seeder = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkDelete('accessTokens', {})
}
