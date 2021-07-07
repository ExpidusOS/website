import { Router } from 'express'
import { validateBody, validateQuery } from '../middleware/validate'
import DIContainer from '../../providers/di'
import genController from '../controllers/publisher'

const schema_find = {
	id: '/PublisherFind',
	type: 'object',
	properties: {
		owner: { type: 'string', required: false, pattern: /(uuid:[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}|username:[A-Za-z0-9]+)/ },
		trusted: { type: 'string', required: false, pattern: /(true|false)/ },
		name: { type: 'string', required: false },
		id: { type: 'string', required: false },
		limit: { type: 'string', required: false, pattern: /[0-9]+/ },
		page: { type: 'string', required: false, pattern: /[0-9]+/ }
	}
}

const schema_create = {
	id: '/PublisherCreate',
	type: 'object',
	properties: {
		name: { type: 'string', required: true },
		desc: { type: 'string', required: false },
		homepage: { type: 'string', required: true },
		email: { type: 'string', format: 'email', required: true }
	}
}

const schema_delete = {
	id: '/PublisherDelete',
	type: 'object',
	properties: {
		id: { type: 'string', required: true }
	}
}

export default function(di: DIContainer): Router {
	const router = Router()
	const controller = genController(di)

	router.get('/find',
		validateQuery(schema_find),
		controller.find
	)

	router.post('/',
		di.oauth.authenticate({ allowBearerTokensInQueryString: true }),
		validateBody(schema_create),
		controller.create
	)

	router.delete('/',
		di.oauth.authenticate({ allowBearerTokensInQueryString: true }),
		validateBody(schema_delete),
		controller.delete
	)

	return router
}
