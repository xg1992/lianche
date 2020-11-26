<template>
	<view>
		<view class="grace-body2">
			<view class=" grace-list">
				<view class="items" hover-class="none" @tap="clear">
					<view class="iconfont  icon-lc-30 "></view>
					<view class="body">
						<view class="title grace-h5">清除缓存</view>
					</view>
				</view>
				<view class="items" @click="Signout" v-if="uid">
					<view class="iconfont  icon-logout"></view>
					<view class="body">
						<view class="title grace-h5">退出登录</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		clearAllVideoCache
	} from '@/common/common.js'
	export default {
		data() {
			return {

			}
		},
		computed: {
			uid() {
				return this.$api.storage('uid')
			}
		},
		methods: {
			...mapMutations(['logout']),
			load() {
				let that = this;
				that.$api.request('My/Index/main', {
					uid: this.$api.storage('uid')
				}).then(res => {
					// console.log(res);
					that.all = res.data;
					let userinfo = that.$api.storage('userinfo');
					userinfo.roleVal = res.data.roleVal;
					that.$api.storage('userinfo', userinfo);
				});
			},
			Signout() {
				this.$confirm({
					content: '确认退出当前账号？',
					confirm:()=>{
						this.logout()
						uni.removeStorageSync('token');
						uni.removeStorageSync('uid');
						uni.removeStorageSync('logintime');
						uni.removeStorageSync('userinfo');
						const pages = getCurrentPages(); //获取当前页面的页面栈
						const prevPage = pages[pages.length - 2]; //获取上级页面的page对象
						prevPage.$vm.all = ''
						uni.showToast({
							title: '退出成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					},
					cancel(){
						console.log('取消')
					},
				})
			},
			clear() {
				clearAllVideoCache()
			}
		}
	};
</script>
<style>
	view {
		box-sizing: content-box;
	}

	.grace-ucenter-body {
		padding: 0 14rpx !important;
	}

	.grace-ucenter-header {
		width: 750rpx;
	}

	.grace-ucenter-face {
		width: 120rpx;
		height: 120rpx;
		margin-left: 17rpx;
		overflow: hidden;
		flex-shrink: 0;
	}

	.grace-ucenter-face-img {
		width: 110rpx;
		height: 110rpx;
		border-radius: 110rpx;
	}

	.grace-ucenter-name {
		display: block;
		width: 700rpx;
		margin-left: 30rpx;
		font-size: 36rpx;
		color: #ffffff;
		font-weight: bold;
	}

	.grace-box-banner {
		background: none;
	}

	.grace-box-banner view,
	navigator {
		border: none !important;
	}

	.status-badge {
		width: 168rpx;
		height: 65rpx;
		border-radius: 34rpx 0 0 34rpx;
		font-size: 32rpx;
		background: #2e3045;
		text-align: center;
	}

	.user-desc {
		margin: 0 20rpx 20rpx 35rpx;
		font-size: 28rpx;
		color: #b3b3bb;
		line-height: 26px;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.follow-data-line1 {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		line-height: 40rpx;
		text-align: center;
	}

	.follow-data-line2 {
		font-size: 24rpx;
		color: #b3b3bb;
		line-height: 24rpx;
		text-align: center;
		margin-top: 20rpx;
	}

	.grace-ucenter-hbtn {
		margin: 30rpx;
		background: linear-gradient(45deg, #ffd138, #ff00c9);
		color: #ffffff;
		height: 88rpx;
		border-radius: 60rpx;
	}

	.grace-ucenter-hbtn-text {
		font-size: 38rpx;
		color: #ffffff;
		margin-right: 20rpx;
	}

	.grace-ucenter-funs {
		margin-bottom: 50rpx;
		background-color: #212438;
		padding: 10rpx 25rpx;
		border-radius: 8rpx;
	}

	.grace-ucenter-logoff {
		margin-top: 10rpx;
	}

	.grace-ucenter-logoff-text {
		margin: 0 10rpx;
		line-height: 80rpx;
		color: #999999;
		font-size: 28rpx;
	}

	.funs-menu {
		margin-bottom: 50rpx;
		border-bottom: 20rpx solid #24263a;
	}

	.grace-list>.items {
		height: 96rpx;
	}

	.grace-list>.items>.body {
		border-bottom: 0;
	}

	.grace-list>.items>.body>.title {
		font-size: 30rpx;
	}

	.items-border {
		border-bottom: 1rpx solid #24263a;
	}

	.grace-list .items .arrow-right:before {
		content: '\E601';
		color: #b3b3bb;
	}

	/* .grace-body2 {padding-left: 10rpx;padding-right: 12rpx;} */
	.grace-grids .text {
		font-size: 30rpx;
	}

	.grace-body2 .iconfont {
		margin-left: 26rpx;
		font-size: 37rpx;
	}
</style>
