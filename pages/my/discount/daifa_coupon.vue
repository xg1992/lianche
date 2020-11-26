<template>
	<view class="coupon-body">
		<view class="arch-bg">
			<view class="title">优惠券标识</view>
			<view class="">
				<input class="tag-input" type="number" v-model="tagNumber" placeholder="请输入优惠券标识" />
			</view>
			<view class="">
				<button class="btn-detail" type="primary" @click="toDetail">查看优惠券</button>
			</view>
		</view>
		<view class="rule" @click="openRule">
			<text>使用规则，优惠券使用详则</text>
			<view class="iconfont icon-arrow-right"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				tagNumber: null
			}
		},
		methods: {
			openRule(){
				uni.navigateTo({
					url: 'rule_detail'
				})
			},
			toDetail(){
				if(!this.tagNumber){
					uni.showToast({
						title: '请输入优惠券标识',
						icon: 'none'
					})
					return ;
				}
				uni.navigateTo({
					url: 'daifa_detail?isAdd=1&id='+this.tagNumber,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.coupon-body {
	padding: 30rpx;
}
.arch-bg {
	box-xizing: border-box;
	padding: 40rpx 50rpx;
	width: 100%;
	height: 400rpx;
	background: #F3F3F4;
	background: radial-gradient(circle at 0 50%, transparent 20rpx, #F3F3F4 21rpx) top left,
							radial-gradient(circle at 100% 50%, transparent 20rpx, #F3F3F4 21rpx) top right;
	background-size: 60% 100%;
	background-repeat: no-repeat;
	border-radius: 16rpx 16rpx 0 0;
	
	view {
		color: #333;
	}
	.title {
		font-size: 32rpx;
		color: #2E3045;
		margin-bottom: 30rpx;
	}
	.tag-input {
		padding: 0 20rpx;
		width: 100%;
		height: 88rpx;
		background: #F7F6F5;
		border: 1px solid #B3B3BB;
		border-radius: 16rpx;
	}
	.btn-detail {
		margin-top: 50rpx;
		background-color: #F6A704;
		color: #fff;
		border: 0;
	}
}
.rule {
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 112rpx;
	line-height: 112rpx;
	color: #B3B3BB;
	background: #25273C;
	border-radius: 0px 0px 16px 16px;
	padding: 0 30rpx;
	box-sizing: border-box;
	
	.icon-arrow-right {
		color: #B3B3BB;
		font-size: 36rpx;
	}
}
</style>
