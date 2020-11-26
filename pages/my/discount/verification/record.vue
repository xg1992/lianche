<template>
	<view class="rule-detail">
		<template v-for="item in list">
			<view class="rule-detail-body2">
				<view class="rule-top2">
					<text class="list-title">{{item.title}}</text>
				</view>
				<view class="circle-box other">
					<view class="circle-left"></view>
					<view class="circle-center"></view>
					<view class="circle-right"></view>
				</view>
				<view class="rule-bottom">
					<view class="list-row">
						<text class="list-content-title">门店</text>
						<text class="list-content">{{item.shop}}</text>
					</view>
					<view class="list-row">
						<text class="list-content-title">核销员</text>
						<text class="list-content">{{item.saler}}</text>
					</view>
					<view class="list-row">
						<text class="list-content-title">方式</text>
						<text class="list-content">{{item.type}}</text>
					</view>
					<view class="list-row">
						<text class="list-content-title">状态</text>
						<text class="list-content">{{item.status}}</text>
					</view>
					<view class="list-row">
						<text class="list-content-title">核销时间</text>
						<text class="list-content">{{item.time}}</text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				list: [{
						title: "暑期学车优惠券",
						shop: "天河公园店",
						saler: "韩梅梅",
						type: "手动",
						status: "核销成功",
						time: "2020/11/01 00:00:00"
					},
					{
						title: "双十一学车优惠券",
						shop: "天河公园店",
						saler: "韩梅梅",
						type: "扫描",
						status: "核销成功",
						time: "2020/11/01 00:00:00"
					},
					{
						title: "双十一学车优惠券",
						shop: "天河公园店",
						saler: "韩梅梅",
						type: "扫描",
						status: "核销成功",
						time: "2020/11/01 00:00:00"
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
.rule-detail {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 30rpx;
	}

	.rule-detail-body2 {
		position: relative;
		width: 100%;
		border-radius: 20rpx;
		margin-bottom: 32rpx;
		overflow: hidden;
	}

	.rule-bottom {
		background-color: #2E3045;
		padding: 60rpx 30rpx;
	}
	
	.rule-top2 {
		background-color: #26283C;
		padding: 40rpx 0 20rpx;
	}

	.rule-detail-h2 {
		margin-bottom: 30rpx;
		font-size: 36rpx;
		color: #FFF;
	}
	.circle-box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		
		.circle-left {
			position: relative;
			width: 15px;
			height: 20px;
			background-image: radial-gradient(circle farthest-side at 0 10px, transparent 10px, #2E3045 10px);
		}
	
		.circle-center {
			position: relative;
			flex: 1;
			height: 20px;
			background: linear-gradient(to bottom, #26283C 9px,#191C2F 9px,#2E3045 11px);
		}
		.circle-right {
			position: relative;
			width: 15px;
			height: 20px;
			background-image: radial-gradient(circle farthest-side at 15px 10px, transparent 10px, #2E3045 10px);
		}
		.circle-left::after,.circle-right::after {
			position: absolute;
			top: 0;
			left: 0;
			content: '';
			width: 100%;
			height: 10px;
		}
		.circle-right::after {
			background-image: radial-gradient(circle farthest-side at 15px 10px, transparent 10px, #26283C 10px);
		}
		.circle-left::after {
			background-image: radial-gradient(circle farthest-side at 0 10px, transparent 10px, #26283C 10px);
		}
	}

.list-row {
	display: flex;
}
.list-title{
	height: 39rpx;
	font-size: 40rpx;
	font-family: PingFang SC;
	color: #FFFFFF;
	margin-left: 70rpx;
}
.list-content-title{
	display: inline-block;
	width: 150rpx;
	height: 29rpx;
	font-size: 30rpx;
	margin-left: 50rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: #B3B3BB;
}
.list-content{
	flex: 1;
	height: 60rpx;
	font-size: 34rpx;
	font-family: PingFang SC;
	color: #FFFFFF;
}
</style>
