const user = {
	state: {
		schedulingInfo: null,
	},
	mutations: {
		schedulingInfo: (state, param) => {
			state.schedulingInfo = param;
		},
	}
}

export default user