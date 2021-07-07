import { Request, Response, NextFunction } from 'express'
import got from 'got'
import AccessToken from '../../database/models/accesstoken'
import Client from '../../database/models/client'
import User from '../../database/models/user'
import DIContainer from '../../providers/di'
import { HttpBadRequestError } from '../exceptions'
import { BaseMessage } from '../../message'
import config from '../../config'

export default function(di: DIContainer) {
	return {
		async find(req: Request, res: Response, next: NextFunction) {
			try {
				const query: Record<string, any> = {};
				let limit = 255
				let pageNumber = 0

				if (typeof req.query.owner === 'string') {
					if (req.query.owner.startsWith('uuid:')) {
						query.customData = {
							'owner': req.query.owner.split(':')[1]
						}
					} else if (req.query.owner.startsWith('username:')) {
						const user = await User.findOne({
							where: { username: req.query.owner.split(':')[1] }
						})

						if (user === null) {
							throw new HttpBadRequestError('User does not exist')
						}

						query.customData = {
							'owner': user.uuid
						}
					}
				}

				if (typeof req.query.trusted === 'string') {
					query.customData = {
						...(query.customData || {}),
						'trusted': req.query.trusted === 'true' ? true : false
					}
				}
				if (typeof req.query.name === 'string') query['name'] = req.query.name
				if (typeof req.query.id === 'string') query['developerId'] = req.query.id
				if (typeof req.query.page === 'string') pageNumber = parseInt(req.query.page)
				if (typeof req.query.limit === 'string') limit = parseInt(req.query.limit)

				const { body } = await got('https://market.openchannel.io/v2/developers?query=' + encodeURI(JSON.stringify(query) + `&pageNumber=${pageNumber}&limit=${limit}`), {
					responseType: 'json',
					username: config.openchannel.marketplaceID,
					password: config.openchannel.secret
				})

				res.json(new BaseMessage({
					pageCount: body.pages,
					currentPage: body.pageNumber,
					results: body.list.map((pub) => ({
						id: pub.developerId,
						created: new Date(pub.created),
						trusted: pub.customData.trusted,
						owner: pub.customData.owner,
						email: pub.customData.email,
						homepage: pub.customData.homepage,
						desc: pub.customData.desc,
						name: pub.name
					}))
				}, 'publisher:find'))
			} catch (e) {
				next(e)
			}
		},
		async create(req: Request, res: Response, next: NextFunction) {
			try {	
				const access_token = await AccessToken.findOne({
					where: { token: res.locals.oauth.token.accessToken }
				})
				if (access_token == null) {
					throw new HttpBadRequestError('Access token does not exist')
				}

				const client = await Client.findOne({
					where: { id: access_token.client_id }
				})
				if (client == null) {
					throw new HttpBadRequestError('Client does not exist')
				}

				if (!client.hasPermission(['publisher:create'])) {
					throw new HttpBadRequestError('Client does not have permission to create publishers')
				}

				const publisher = await Publisher.findOne({
					where: { name: req.body.name }
				})

				if (publisher !== null) {
					throw new HttpBadRequestError('Publisher already exists with that name')
				}

				const createdPublisher = await Publisher.create({
					owner_uuid: access_token.uuid,
					name: req.body.name,
					homepage: req.body.homepage,
					desc: req.body.desc,
					email: req.body.email
				})

				res.json(new BaseMessage({
					id: createdPublisher.uuid,
					name: createdPublisher.name,
					desc: createdPublisher.desc,
					email: createdPublisher.email,
					homepage: createdPublisher.homepage,
					trusted: createdPublisher.trusted
				}, 'publisher:create'))
			} catch (e) {
				next(e)
			}
		},
		async delete(req: Request, res: Response, next: NextFunction) {
			try {
				const access_token = await AccessToken.findOne({
					where: { token: res.locals.oauth.token.accessToken }
				})
				if (access_token == null) {
					throw new HttpBadRequestError('Access token does not exist')
				}

				const client = await Client.findOne({
					where: { id: access_token.client_id }
				})
				if (client == null) {
					throw new HttpBadRequestError('Client does not exist')
				}

				if (!client.hasPermission(['publisher:delete'])) {
					throw new HttpBadRequestError('Client does not have permission to destroy publishers')
				}

				const publisher = await Publisher.findOne({
					where: { uuid: req.body.id, owner_uuid: access_token.uuid }
				})
				if (publisher === null) {
					throw new HttpBadRequestError('Publisher does not exist')
				}

				await publisher.destroy()

				res.json(new BaseMessage({ success: true }, 'publisher:delete'))
			} catch (e) {
				next(e)
			}
		}
	}
}
