const address = {
	state: {
		mapSelectAddress: null,//地图选中地址
		editAddress:null,// 编辑中的地址
		selectAddress:null,// 选中的地址
	},
	mutations: {
		setMapSelectAddress: (state, param) => {
			state.mapSelectAddress = param;
		},
		setEditAddress: (state, param) => {
			state.editAddress = param;
		},
		setSelectAddress: (state, param) => {
			state.selectAddress = param;
		},
	}
}

export default address
