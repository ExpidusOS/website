/* eslint-env jest */
import supertest from 'supertest'
import app from '../../src/http/app'
import User from '../../src/database/models/user'
import { sequelize } from '../../src/database'
import { seeder } from '../../src/umzug'
import qs from 'qs'

describe('E2E - Publisher', () => {
	const request = supertest(app)
	let id: string | undefined

	beforeAll(async () => {
		await sequelize.authenticate()
		await sequelize.sync({ force: true })
		await seeder.up()
	})

	afterAll(async () => {
		await seeder.down()
		await sequelize.close()
	})

	describe('POST /v1/publisher/', () => {
		test('invalid access token', () => request
			.post('/v1/publisher/?access_token=none')
			.expect(500))

		test('create demo publisher', () => request
			.post('/v1/publisher/?access_token=dummy_token')
			.send(qs.stringify({
				name: 'Demo Publisher',
				email: 'demo@example.com',
				homepage: 'https://example.com'
			}))
			.expect((response: any) => {
				expect(response.status).toBe(200)
				expect(response.body).toMatchObject({
					data: {
						name: 'Demo Publisher',
						email: 'demo@example.com',
						homepage: 'https://example.com',
						trusted: false
					},
					type: 'publisher:create'
				})
				id = response.body.data.id
			}))
	})

	describe('DELETE /v1/publisher/', () => {
		test('delete demo publisher', () => request
			.delete('/v1/publisher/')
			.send(qs.stringify({
				access_token: 'dummy_token',
				id
			}))
			.expect((response: any) => {
				expect(response.status).toBe(200)
				expect(response.body).toMatchObject({
					data: {
						success: true
					},
					type: 'publisher:delete'
				})
			}))
	})

	describe('GET /v1/publisher/find', () => {
		test('invalid uuid owner', () => request
			.get('/v1/publisher/find?owner=uuid:an-invalid-uuid')
			.expect(422))

		test('invalid username owner', () => request
			.get('/v1/publisher/find?owner=username:@wont-work')
			.expect(422))

		test('find by username - who doesn\'t exist', () => request
			.get('/v1/publisher/find?owner=username:JackRock')
			.expect(400))

		test('find', () => request
			.get('/v1/publisher/find?trusted=true&name=Google&id=650e8c21-cb34-4cb7-9712-d726e2eae59d')
			.expect((response: any) => {
				expect(response.status).toBe(200)
				expect(response.body).toMatchObject({
					data: [],
					type: 'publisher:find'
				})
			}))

		test('find by username', () => request
			.get('/v1/publisher/find?owner=username:JohnSmith')
			.expect((response: any) => {
				expect(response.status).toBe(200)
				expect(response.body).toMatchObject({
					data: [],
					type: 'publisher:find'
				})
			}))

		test('find by user id', () => request
			.get('/v1/publisher/find?owner=uuid:d95f83f7-d40f-4071-b650-a98e03e368c2')
			.expect((response: any) => {
				expect(response.status).toBe(200)
				expect(response.body).toMatchObject({
					data: [],
					type: 'publisher:find'
				})
			}))

		test('single publisher', () => request
			.get('/v1/publisher/find?limit=1&offset=0')
			.expect((response: any) => {
				expect(response.status).toBe(200)
				expect(response.body).toMatchObject({
					data: [
					],
					type: 'publisher:find'
				})
			}))
	})
})
