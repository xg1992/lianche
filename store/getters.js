const getters = {
	token: state => {
		try {
			return state.user.token || uni.getStorageSync('token')
		} catch (e) {
			return 0;
		}
	},
	userInfo: state => {
		return state.user.userInfo || uni.getStorageSync('userinfo')
	},
	// 排班信息
	schedulingInfo: state => {
		return state.scheduling.schedulingInfo
	},
	// 地图选中地址
	mapSelectAddress :state => {
		return state.address.mapSelectAddress
	},
	// 编辑中的地址
	editAddress :state => {
		return state.address.editAddress
	},
	// 选中的地址
	selectAddress :state => {
		return state.address.selectAddress
	},
}
export default getters
