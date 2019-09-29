export const getters = {
	authenticated(state) {
		return state.loggedIn;
	},
	user(state) {
		return state.user;
	}
};

export const mutations = {
	updateImage(state, data) {
		if (data.type == 1) {
			state.user.image_url = data.file;
		} else {
			state.user.bg_url = data.file;
		}
	},
};

export const state = () => ({
	busy: false,
	loggedIn: false,
	strategy: false,
	user: false
});