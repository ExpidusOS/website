import { Router } from 'express'
import { validateBody } from '../middleware/validate'
import DIContainer from '../../providers/di'
import genController from '../controllers/user'

const schema_register = {
	id: '/UserRegister',
	type: 'object',
	properties: {
		username: { type: 'string', pattern: /[A-za-z0-9]+/, minLength: 5 },
		password: { type: 'string', minLength: 8 },
		email: { type: 'string', format: 'email' },
		birthdate: { type: 'string', format: 'date' },
	},
	required: ['username', 'password', 'email', 'birthdate']
}

export default function(di: DIContainer): Router {
	const router = Router()
	const controller = genController(di)
	
	router.get('/auth', di.oauth.authorize({
		allowEmptyState: true
	}))
	router.post('/token', di.oauth.token())

	router.post(
		'/register',
		validateBody(schema_register),
		controller.register
	)

	router.get(
		'/info',
		di.oauth.authenticate({ allowBearerTokensInQueryString: true }),
		controller.info
	)

	return router
}
