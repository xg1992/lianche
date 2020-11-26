import Vue from 'vue'
import App from './App'
import './common/h5clip'
import api from './common/api.js'
// #ifdef H5
import 'babel-polyfill' // es6转es5工具
// #endif
Vue.prototype.$api = api

Vue.config.productionTip = false
import config from "./config"

import {
	realSrc,
	confirm
} from "./common/common.js"
Vue.prototype.$confirm = confirm;
import store from "./store";
// 全局缺省页
import listEmpty from '@/components/list-empty/index.vue'
Vue.component('list-empty', listEmpty)

// 全局过滤器
import filters from './common/filter.js'
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 状态数据
Vue.prototype.$store = store;
App.mpType = 'app'

//安卓平台返回隐藏app
//#ifdef APP-PLUS
if (uni.getSystemInfoSync().platform == "android") {
	let main = plus.android.runtimeMainActivity();
	//为了防止快速点按返回键导致程序退出重写quit方法改为隐藏至后台
	plus.runtime.quit = function() {
		main.moveTaskToBack(false);
	};
	//重写toast方法如果内容为 ‘再按一次退出应用’ 就隐藏应用，其他正常toast
	plus.nativeUI.toast = (function(str) {
		if (str == '再按一次退出应用') {
			main.moveTaskToBack(false);
			return false;
		} else {
			uni.showToast({
				title: str,
				icon: 'none',
			})
		}
	});
}
//#endif
Vue.mixin({
	methods: {
		$realSrc(src) {
			return realSrc(src)
		}
	}
})
let temp = console.log
// console.log = function() {
// 	temp('-----------------------------------------------------------------------------')
// 	temp(Object.values(arguments))
// }
const app = new Vue({
	store,
	...App
})
app.$mount()
