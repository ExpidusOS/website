import { Sequelize, Model, DataTypes } from 'sequelize'

export default class Client extends Model {
	public id!: string
	public secret!: string
	public grants!: string[]
	public redirects!: string[]
	public perms!: string[]

	hasPermission(perms: string[]): boolean {
		const allPerms = perms.map((perm) => `${perm.split(':')}:all`).filter((c, index, array) => array.indexOf(c) === index)
		if (this.perms.filter((perm) => allPerms.indexOf(perm) !== -1).length === 0) return true

		for (const perm in perms) {
			if (this.perms.indexOf(perm) == -1) return false
		}
		return true
	}

	static initializeModel(sequelize: Sequelize): Model {
		return Client.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
				unique: true
			},
			secret: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			redirects: {
				type: DataTypes.STRING,
				allowNull: true,
				set(value: string[]) {
					this.setDataValue('redirects', value.join(','))
				},
				get() {
					return (this.getDataValue('redirects') || '').split(',')
				}
			},
			grants: {
				type: DataTypes.STRING,
				allowNull: true,
				set(value: string[]) {
					this.setDataValue('grants', value.join(','))
				},
				get() {
					return (this.getDataValue('grants') || '').split(',')
				}
			},
			perms: {
				type: DataTypes.STRING,
				allowNull: true,
				set(value: string[]) {
					this.setDataValue('perms', value.join(','))
				},
				get() {
					return (this.getDataValue('perms') || '').split(',')
				}
			}
		}, {
			sequelize,
			modelName: 'client'
		})
	}
}
