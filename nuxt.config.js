const colors = require('vuetify/es5/util/colors').default;
const SITE_IP = 'http://188.225.75.245';
// const SITE_IP = 'http://laravel-auth';

module.exports = {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
        titleTemplate: '%s',
        title: process.env.npm_package_name || '',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},
    /*
    ** Global CSS
    */
    css: [],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
    	'plugins/mixins/validation',
		'plugins/mixins/user',
		'plugins/axios',
		{ src: '@/plugins/socket', ssr: false }
	],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
		'@nuxtjs/axios',
        // Doc: https://github.com/nuxt-community/eslint-module
        // '@nuxtjs/eslint-module',
        '@nuxtjs/vuetify',
        '@nuxtjs/auth'
    ],
    axios: {
        baseURL: SITE_IP + '/api'
    },
	router: {
    	middleware: [
    		'clearValidationErrors',
			'profileInfo'
		]
	},
    auth: {
		strategies: {
			local: {
				endpoints: {
					login: {
						url: SITE_IP + '/api/auth/login', method: "post", propertyName: 'token'
					},
					user: {
						url: SITE_IP + '/api/me', method: "get", propertyName: 'data'
					},
					logout: {
						url: SITE_IP + '/api/auth/logout', method: "get"
					}
				}
			}
		}
    },
    /*
    ** Nuxt.js modules
    */
    modules: [
	],
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },
    /*
    ** Build configuration
    */
    build: {
    	standalone: true,
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
        }
    }
}
