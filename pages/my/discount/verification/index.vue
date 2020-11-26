<template>
	<view class="pt50">
		<tab class="top-tab" :list="tab" @tab="tabChange" :active="tabFlag"></tab>
		<!-- 手动核销 -->
		<scan v-show="tabFlag==0"></scan>
		
		<!-- 核销记录 -->
		<record v-show="tabFlag==1"></record>
	</view>
</template>

<script>
	import tab from '@/components/tab.vue'
	import scan from './scan.vue'
	import record from './record.vue'
	export default {
		components: {
			tab,
			scan,
			record
		},
		data() {
			return {
				tab: ['手动核销', '核销记录'],
				tabFlag: 0,
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/my/discount/verification_people_list'
			})
		},
		methods: {
			tabChange(params) {
				this.tabFlag = params.index
				console.log(params)
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.pt50 {
		padding-top: 100rpx;
	}
	.top-tab {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 99;
		background-color: #191C2F;
	}
	
</style>
