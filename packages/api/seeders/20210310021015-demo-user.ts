import { Seeder } from '../src/umzug'

export const up: Seeder = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkInsert('users', [
		{
			uuid: 'd95f83f7-d40f-4071-b650-a98e03e368c2',
			username: 'JohnSmith',
			email: 'john.smith@example.com',
			password: 'averyinsecurepassword',
			birthdate: new Date('1900-01-01'),
			createdAt: new Date(),
			updatedAt: new Date()
		}
	])
}

export const down: Seeder = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().bulkDelete('users', {})
}
