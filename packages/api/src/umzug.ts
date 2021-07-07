import { Umzug, SequelizeStorage } from 'umzug'
import { sequelize } from './database'
import winston from './providers/winston'

export const seeder = new Umzug({
	migrations: {
		glob: ['seeders/*.ts', { cwd: `${__dirname}/../` }]
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
		modelName: 'seeder_meta'
	}),
	logger: winston
})

export type Seeder = typeof seeder._types.migration
