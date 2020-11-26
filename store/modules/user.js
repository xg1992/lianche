const user = {
	state: {
		token: null,
		userInfo:null,
	},
	mutations: {
		setToken: (state, param) => {
			uni.setStorageSync('token',param)
			state.token = param;
		},
		setUserInfo: (state, param) => {
			uni.setStorageSync('userInfo',param)
			state.userInfo = param;
		},
		logout: (state, param) => {
			uni.removeStorageSync('token');
			uni.removeStorageSync('userinfo');
			uni.removeStorageSync('uid');
			uni.removeStorageSync('logintime');
			state.userInfo = null;
			state.token = null;
		},
	}
}

export default user
