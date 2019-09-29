import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function ({store}) {
	Vue.use(new VueSocketIO({
			debug: true,
			connection: 'http://188.225.75.245:3000', //options object is Optional
			// connection: 'http://localhost:3000', //options object is Optional
			vuex: {
				store,
				actionPrefix: "SOCKET_",
				mutationPrefix: "SOCKET_"
			}
		})
	);
}