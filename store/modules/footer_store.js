export default {
	state: {
		tabbar_list: [{
				name: '首页',
				name_code: 'shortvideo',
				icon: '',
				select_icon: '',
				size: 'small'
			},
			{
				name: '动态',
				name_code: 'dynamic',
				icon: '',
				select_icon: '',
				size: 'small'
			},
			{
				name: '',
				name_code: 'publish',
				icon: '/static/fb.png',
				select_icon: '/static/fb.png',
				size: 'big'
			},
			{
				name: '预约',
				name_code: 'release',
				icon: '',
				select_icon: '',
				size: 'small'
			},

			{
				name: '我的',
				name_code: 'my',
				icon: '',
				select_icon: '',
				size: 'small'
			},

		],
		now_page_index: 0,
	},
	mutations: {
		change_nav_list(state, data) {
			state.tabbar_list = data;
		},
		change_page(state, index) {
			state.now_page_index = index;
		}
	},
	actions: {
		menu_5(ctx) {
			let menu_list = [{
					name: '首页',
					name_code: 'home',
					icon: '/static/footer_icon/a2.png',
					select_icon: '/static/footer_icon/a1.png',
					size: 'small'
				},
				{
					name: '我的',
					name_code: 'my',
					icon: '/static/footer_icon/d1.png',
					select_icon: '/static/footer_icon/d2.png',
					size: 'small'
				},
				{
					name: '发布',
					name_code: 'publish',
					icon: '/static/footer_icon/f2.png',
					select_icon: '/static/footer_icon/f1.png',
					size: 'big'
				},
				{
					name: '我的',
					name_code: 'my',
					icon: '/static/footer_icon/d1.png',
					select_icon: '/static/footer_icon/d2.png',
					size: 'small'
				},

				{
					name: '我的',
					name_code: 'my',
					icon: '/static/footer_icon/d1.png',
					select_icon: '/static/footer_icon/d2.png',
					size: 'small'
				},
			]

			ctx.commit("change_nav_list", menu_list)
		}
	}
}
