import Vue from 'vue'
import Vuex from 'vuex'
import footer_store from "./modules/footer_store.js"
import user from "./modules/user.js"
import scheduling from "./modules/scheduling.js"
import address from "./modules/address.js"

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
	// state: {
	// 	loading:'0',
	// 	base_url:"https://lianche.haoshuninfo.com/",
	// 	list:[],
	// 	detail:'',
	// 	userinfo:'',
	// 	token:'',
	// 	Version:'0.3.4'
	// },
	modules:{
		footer_store,
		user,
		scheduling,
		address,
	},
	getters
})

export default store
