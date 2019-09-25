import axios from 'axios';

export const state = () => ({
	errors: {}
});

export const getters = {
	errors(state) {
		return state.errors
	}
};

export const mutations = {
	SET_VALIDATION_ERRORS(state, errors) {
		state.errors = errors;
	}
};

export const actions = {
	setErrors({commit}, errors) {
		console.log('set errors');
		commit('SET_VALIDATION_ERRORS', errors);
	},
	async setProfileInfo({commit}, errors) {
		commit('GET_PROFILE_INFO', errors);
	},
	clearErrors({commit}) {
		console.log('clear errors');
		commit('SET_VALIDATION_ERRORS', {});
	}
};

