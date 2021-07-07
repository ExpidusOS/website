import bcrypt from 'bcrypt'
import OAuth2Server from 'oauth2-server'
import AccessToken from './database/models/accesstoken'
import AuthCode from './database/models/authcode'
import Client from './database/models/client'
import User from './database/models/user'
import DIContainer from './providers/di'

export default class OAuthModel implements OAuth2Server.PasswordModel, OAuth2Server.AuthorizationCodeModel {
	private di: DIContainer

	constructor(di: DIContainer) {
		this.di = di
	}

	async saveAuthorizationCode(code: OAuth2Server.AuthorizationCode, _client: OAuth2Server.Client, _user: OAuth2Server.User): Promise<OAuth2Server.AuthorizationCode> {
		const auth_code = await AuthCode.create({
			expires: code.expiresAt,
			code: code.authorizationCode,
			redirect: code.redirectUri,
			scope: code.scope,
			client_id: _client.id,
			uuid: _user.uuid
		})

		const user = await User.findOne({
			where: { uuid: auth_code.get('uuid') }
		})
		if (!user) throw new Error('Unknown user')

		const client = await Client.findOne({
			where: { id: auth_code.get('client_id') }
		})
		if (!client) throw new Error('Unknown client')

		return {
			expiresAt: auth_code.get('expires'),
			authorizationCode: auth_code.get('code'),
			redirectUri: auth_code.get('redirect'),
			scope: auth_code.get('scope'),
			client: {
				id: client.id,
				grants: client.grants,
				redirectUris: client.redirects
			},
			user: user.toJSON()
		}
	}

	async getAuthorizationCode(code: string): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
		const auth_code = await AuthCode.findOne({
			where: { code }
		})
		if (!auth_code) return false

		const user = await User.findOne({
			where: { uuid: auth_code.get('uuid') }
		})
		if (!user) throw new Error('Unknown user')

		const client = await Client.findOne({
			where: { id: auth_code.get('client_id') }
		})
		if (!client) throw new Error('Unknown client')

		return {
			expiresAt: auth_code.get('expires'),
			authorizationCode: auth_code.get('code'),
			redirectUri: auth_code.get('redirect'),
			scope: auth_code.get('scope'),
			client: {
				id: client.id,
				grants: client.grants,
				redirectUris: client.redirects
			},
			user: user.toJSON()
		}
	}

	async revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode): Promise<boolean> {
		const auth_code = await AuthCode.findOne({
			where: { code: code.authorizationCode }
		})
		if (!auth_code) return false
		await auth_code.destroy()
		return true
	}

	async getAccessToken(token: string): Promise<OAuth2Server.Token> {
		this.di.logger.debug(`Receiving access token: ${token}`)

		const access_token = await AccessToken.findOne({
			where: { token }
		})
		if (!access_token) throw new Error('Invalid access token')

		const user = await User.findOne({
			where: { uuid: access_token.get('uuid') }
		})
		if (!user) throw new Error('Invalid user')

		const client = await Client.findOne({
			where: { id: access_token.get('client_id') }
		})
		if (!client) throw new Error('Invalid client')

		return {
			accessToken: access_token.get('token'),
			accessTokenExpiresAt: access_token.get('expires'),
			scope: access_token.get('scope'),
			client: {
				id: client.id,
				grants: client.grants,
				redirectUris: client.redirects
			},
			user: user.toJSON()
		}
	}

	async getClient(client_id: string, client_secret: string): Promise<OAuth2Server.Client | OAuth2Server.Falsey> {
		this.di.logger.debug(`Getting client: ${client_id} ${(client_secret || '').split('').map(() => '*').join('')}`)

		const client = await Client.findOne({
			where: { id: client_id }
		})
		if (!client) return false

		if (client_secret !== null) {
			if (client.secret != client_secret) return false
		}

		return {
			id: client.id,
			redirectUris: client.redirects,
			grants: client.grants
		}
	}

	async getUser(username: string, pword: string): Promise<OAuth2Server.User | OAuth2Server.Falsey> {
		this.di.logger.debug(`Getting user: ${username} ${pword.split('').map(() => '*').join('')}`)
		const user = await User.findOne({
			where: { username }
		})

		if (!user) throw new Error('User does not exist')

		if (!bcrypt.compareSync(pword, user.get('password'))) return false
		return user
	}

	async saveToken(token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.Token> {
		const access_token = await AccessToken.create({
			token: token.accessToken,
			expires: token.accessTokenExpiresAt,
			scope: token.scope,
			uuid: user.uuid,
			client_id: client.id
		})

		if (!access_token) throw new Error('Invalid access token')

		const the_client = await Client.findOne({
			where: { id: client.id }
		})

		if (!the_client) throw new Error('Invalid client')

		const tokenUser = await User.findOne({ where: { uuid: user.uuid } })

		if (!tokenUser) throw new Error('Invalid user')

		return {
			accessToken: access_token.get('token'),
			accessTokenExpiresAt: access_token.get('expires'),
			scope: access_token.get('scope'),
			client: {
				id: the_client.id,
				grants: the_client.grants,
				redirectUris: the_client.redirects
			},
			user: tokenUser.toJSON()
		}
	}

	async revokeToken(token: OAuth2Server.Token): Promise<boolean> {
		const access_token = await AccessToken.findOne({
			where: { token: token.accessToken }
		})
		if (!access_token) return false
		await access_token.destroy()
		return true
	}

	async verifyScope(token: OAuth2Server.Token, scope: string): Promise<boolean> {
		const access_token = await AccessToken.findOne({
			where: { token: token.accessToken }
		})
		if (!access_token) throw new Error('Access token does not exist')
		return access_token.scope == scope
	}
}
