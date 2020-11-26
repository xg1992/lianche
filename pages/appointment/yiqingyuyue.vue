<template>
	<view class="grace-flex grace-columns">
		<view class="grace-flex-center">
			<image class="banner_image" src="../../static/yq_yuyue/banner.png" mode="widthFix"></image>
		</view>
		<view class="grace-body">
			<block v-for="item in textList">
				<view class="duanluojiange">
					<image src="../../static/yq_yuyue/yq.png" class="listyq grace-flex-vcenter"></image>
					<text class="grace-h3">{{item.title}}</text>
				</view>
				<view class="luolie" v-for="item2 in item.list">
					<view class="luolie-list">
						<image src="../../static/yq_yuyue/yuan.png" class="listyuan"></image>
						<text class="luolie-text grace-gray">{{item2.content}}</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	var richText = require('@/graceUI/jsTools/richText.js')
	export default {
		data() {
			return {
				textList: [],
			}
		},
		created: function() {
			this.$api.request('Main/Index/weilaikeqi',{}).then(res=>{
				this.textList = res.data;
			})
		}
	}
</script>
<style>
	.duanluojiange {
		margin-top: 56rpx;
	}

	.luolie {
		margin-left: 34rpx;
	}

	.luolie-list {
		padding-bottom: 14rpx;
	}

	.luolie-text {
		font-size: 32rpx;
	}

	.listyq {
		width: 24rpx;
		height: 24rpx;
		margin-right: 16rpx;
		margin-top: 24rpx;
	}

	.listyuan {
		width: 14rpx;
		height: 14rpx;
		margin-right: 16rpx;
		margin-top: 16rpx;
	}

	.grace-body {
		padding: 0 32rpx;
		width: 100%;
		margin-top: 40rpx;
		overflow: hidden;
	}

	.grace-text {
		font-size: 26rpx;
		line-height: 40rpx;
	}

	.banner_image {
		width: 750rpx;
		height: 320rpx;
	}

	.title {
		width: 168rpx;
		height: 33rpx;
		font-size: 45rpx;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		margin-bottom: 26rpx;
	}

	.desc-margin-top {
		margin-top: 22rpx;
	}
</style>
