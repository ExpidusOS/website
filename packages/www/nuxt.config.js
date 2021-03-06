import { Tokyonight, Tokyoday } from '@expidus/common/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: 'ExpidusOS | %s',
    title: 'ExpidusOS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A private and secure operating system for mobile and desktop devices.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
		'@expidus/common/dist/style.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
		'~/plugins/theme.client.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
		'@nuxtjs/sitemap' // Always last
  ],

	sitemap: {
		hostname: 'http://expidusos.com',
		gzip: true,
		routes: [
			'/',
			'/download',
			'/demo'
		]
	},

	pwa: {
		meta: {
			name: 'ExpidusOS',
			ogTitle: 'ExpidusOS',
			ogSiteName: 'ExpidusOS',
			ogHost: 'expidusos.com',
			ogImage: 'http://expidusos.com/image.png',
			ogUrl: 'http://expidusos.com',
			description: 'A private and secure operating system for mobile and desktop devices.'
		}
	},

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
				light: Tokyoday,
        dark: Tokyonight
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

	server: {
		port: 3000,
		host: '0.0.0.0'
	}
}
