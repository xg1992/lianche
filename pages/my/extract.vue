<template>
	<view>
		<image src="../../static/purse.png" mode="" style="width: 181rpx;height: 205rpx;margin: 70rpx auto 30rpx auto;display: block;"></image>
		<view class="font26 colorb3 center">佣金余额</view>
		<view class="bold pd15 center" style="font-size: 72rpx;">￥100</view>
		<input type="text" value="" placeholder="请输入提现金额" placeholder-class="colorb3" class="numinput"/>
		<view class="center txbtn">申请提现</view>
		<view class="pd15 mgto40 colorb3">满50元可提现，每日最好上限1000元，每天只能提现一次，一个工作日内到账</view>
		<view class="mgto40 pd15" style="color:#FF6562">
			目前为人工提现，每次提现时，请向财务人员（微信号：fjdhfjd）发送：“你好，我要提现！”的指令，即可很快到账

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
.numinput{margin:30rpx;background-color: white;border-radius: 16rpx;height: 88rpx; text-indent: 30rpx;color:#000000}
.txbtn{height:88rpx;background:#F6A704;border-radius:16rpx;color:#FFFFFF;font-size: 34rpx;margin:30rpx;}
</style>
