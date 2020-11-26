<template>
	<view class="quality-body">
		<view class="banner-view">
			<image class="banner-img" src="../../static/images/bg.png" mode="aspectFit"></image>
		</view>
		<view class="quality-content">
			<navigator class="quality" url="/pages/verification/coach?type=1" hover-class="none">
				<view class="quality-left">
					<view class="headimg school">
						<text class="iconfont icon-lc-50"></text>
					</view>
					<view class="quality-info">
						<view class="quality-title">总部认证</view>
						<view class="quality-text">上传企业营业执照</view>
					</view>
				</view>
				<view class="quality-right">
					<view class="verified" v-if="status1">已认证</view>
					<view class="quality-btn" v-else>去认证</view>
				</view>
			</navigator>
			
			<navigator class="quality" url="/pages/verification/coach?type=3" hover-class="none">
				<view class="quality-left">
					<view class="headimg coach">
						<text class="iconfont icon-lc-60"></text>
					</view>
					<view class="quality-info">
						<view class="quality-title">教练认证</view>
						<view class="quality-text">上传教练身份证</view>
					</view>
				</view>
				<view class="quality-school-right">
					<view class="verified" v-if="status2">已认证</view>
					<view class="quality-btn" v-else>去认证</view>
				</view>
			</navigator>
			
			<view class="warm-prompt">
				温馨提示：<br />
				1、登录帐号为将被认证的帐号，提交后无法更换。<br />
				2、认证成功后，我的教校会显示所认证的总部或分部（一个工作日内），超时未通过请联系QQ：583682134
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { qx } from "../../common/api.js"
	export default {
		data(){
			return {
				status1: qx([64]), 
				status2: qx([16]), 
			}
		},
		created() {
			console.log(this.status1,this.status2)
		}
	}
</script>

<style lang="scss" scoped>
.quality-body {
	min-height: 100vh;
	background-color: #F7F6F5;
	color: #2E3045;
}
.banner-view {
	padding: 60rpx 0;
	display: flex;
	justify-content: center;
	background-color: #191C2F;
	.banner-img {
		width: 300rpx;
		height: 270rpx;
	}
}
.quality-content {
	margin-top: -80rpx;
	padding: 0 30rpx;
	
	.quality {
		margin-bottom: 32rpx;
		padding: 60rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0px 18rpx 17rpx 1px rgba(25, 28, 47, 0.04);
		
		.headimg {
			width: 72rpx;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			border-radius: 50%;
			
			&.school {
				background-image: linear-gradient(#FDA275,#FF6262);
			}
			&.coach {
				background-image: linear-gradient(#7AD9F8,#3284EC);
			}
			.iconfont {
				font-size: 52rpx;
			}
		}
		.quality-left {
			display: flex;
		}
		.quality-info {
			padding-left: 30rpx;
		}
		.quality-title {
			color: #191C2F;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		.quality-text {
			color: #B3B3BB;
		}
		.quality-btn {
			width: 160rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			color: #fff;
			font-size: 32rpx;
			border-radius: 32rpx;
			background-color: #F6A704;
		}
		.verified {
			width: 160rpx;
			text-align: center;
			font-size: 32rpx;
			color: #F6A704;
		}
	}
}
.warm-prompt {
	margin: 60rpx 20rpx;
	color: #2E3045;
	font-size: 32rpx;
}
</style>
