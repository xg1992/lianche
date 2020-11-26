<template>
	<view class="pt50">
		<tab class="top-tab" :list="tab" :active="tabFlag" @tab="tabChange"></tab>
		<view class="coupon-list">
			<view class="coupon-item" v-for="item in couponList">
				<coupon
					:info="item"
					:type="item.type" 
					:status="status" 
					:btnText="btnText" 
					:topRightText="'规则'" 
					@onTopRightText="onTopRightText"
					@onInfo="toDetail(item)"
					@onBtn="toDetail(item)">
				</coupon>
			</view>
		</view>
	</view>
</template>

<script>
	import tab from '@/components/tab.vue'
	import coupon from '@/components/coupon/index.vue'
	export default {
		components: {
			tab,
			coupon
		},
		data(){
			return {
				tab: ['可用','已使用','已过期'],
				type: { // 和tab对应的优惠券的状态，1：正常，2：已使用，3：已过期
					'0': 1,
					'1': 2,
					'2': 3,
				},
				tabFlag: 0,
				couponList: [
					{
						id: '1',
						type: '2',
						title:"悦顺模拟考试抵扣券",
						price:"50",
						discountDesc:"满5000可用",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30",
						usertype: 1,
					},
					{
						id: '2',
						type:'1',
						title:"悦顺模拟考试5折券",
						price:"5",
						discountDesc:"",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30",
						usertype: 2
					},
					{
						id: '1',
						type: '2',
						title:"悦顺模拟考试抵扣券",
						price:"50",
						discountDesc:"满5000可用",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30",
						usertype: 1,
					},
					{
						id: '2',
						type:'1',
						title:"悦顺模拟考试5折券",
						price:"5",
						discountDesc:"",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30",
						usertype: 2
					},
					{
						id: '1',
						type: '2',
						title:"悦顺模拟考试抵扣券",
						price:"50",
						discountDesc:"满5000可用",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30",
						usertype: 1,
					},
					{
						id: '2',
						type:'1',
						title:"悦顺模拟考试5折券",
						price:"5",
						discountDesc:"",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30",
						usertype: 2
					},
				],
				status: 1,//优惠券状态，默认正常
				btnText: '查看'
			}
		},
		methods: {
			tabChange(params){
				console.log(params)
				this.tabFlag = params.index;
				this.status = this.type[params.index]
			},
			onTopRightText(item){
				uni.navigateTo({
					url: 'rule_detail'
				})
			},
			toDetail(item){
				console.log(item)
				uni.navigateTo({
					url: `detail?id=${item.id}&usertype=${item.usertype}`,
				})
			}
		}
	}
</script>

<style scoped>
.pt50 {
	padding-top: 100rpx;
}
.coupon-list {
	padding: 30rpx;
}
.coupon-item {
	display: flex;
	justify-content: center;
}
.coupon-item + .coupon-item {
	margin-top: 30rpx;
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
