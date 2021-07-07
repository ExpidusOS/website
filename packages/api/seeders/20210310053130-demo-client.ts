import { Seeder } from '../src/umzug'

export const up: Seeder = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkInsert('clients', [
		{
			id: '5482801f-c2c1-4a5e-86df-d99c3bcca197',
			secret: 'a-fake-secret',
			grants: 'password',
			redirects: '',
			perms: 'profile:all',
			createdAt: new Date(),
			updatedAt: new Date()
		}
	])
}

export const down: Seeder = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkDelete('clients', {})
}
