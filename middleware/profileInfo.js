export default function ({ store }) {
	if (store.getters['auth/authenticated']) {
		return store.$axios.post('user/profile', {user_id: store.state.auth.user.id}).then(res=> {
			// console.log(res.data);
			// console.log(store.state);
			// store.commit('setLikes', res.data[0].likes);
		}).catch((e) => {
			// console.log(e);
		})
	}
	return;
}