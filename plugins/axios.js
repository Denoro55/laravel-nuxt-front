export default function({$axios, store}) {
	$axios.onError(error => {
		if (error.response.status === 422) {
			console.log('Error 422');
			store.dispatch('validation/setErrors', error.response.data.errors);
		} else if (error.response.status === 401) {
			console.log('Error 401');
			// console.log('error 401 catch')
		} else {
			console.log('Error');
			return Promise.reject(error);
		}
	});

	$axios.onRequest((config ) => {
		// config.headers.common['Content-Type'] = 'text/plain;charset=utf-8';
		// config.headers.common['Access-Control-Allow-Origin'] = '*';
		store.dispatch('validation/clearErrors');
	})
}