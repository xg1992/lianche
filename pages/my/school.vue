<template>
	<view class="info">
		<view class="btn-row">
			<view><text>总部</text></view>
			<view><input /></view>
			
		</view>
		<view class="btn-row">
			<view><text>分校</text></view>
			<view><input /></view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.info{ margin-top: 50rpx; margin-left: 40rpx;}
.btn-row{float: left; width: 100%; height: 100rpx; line-height: 100rpx;}
.btn-row view{float: left;}
.btn-row text{color: #B3B3BB; margin-right: 66rpx;width: 58rpx; height: 28rpx;}
.btn-row input{ position: relative; top: 30rpx; color: #FFFFFF;}
</style>
