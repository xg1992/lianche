<template>
	<view>
		<view class="discount-body mpt30">
			<template v-for="item in list">
				<view class="detail" v-if="item.relo.indexOf(relo) >= 0">
					<view class="detail-title">{{item.title}}</view>
					<view class="detail-content">
						<text>{{item.content}}</text>
						<text class="iconfont icon-lc-68 in-right" @click="copy(item.content)" v-if="item.copy"></text>
						<image class="in-right" src="@/static/icons/erweima.png" mode=""  @click="showCode" v-if="item.code"></image>
					</view>
				</view>
			</template>
			<view class="rule" @click="openRule">
				<text>使用规则，优惠券使用详则</text>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		<br />
		<!-- 使用记录 -->
		<template v-if="relo === 2">
			<view class="discount-body">
				<view class="detail">
					<view class="detail-title">领取时间</view>
					<view class="detail-content">2020-11-1 00:00:00</view>
				</view>
				<view class="detail">
					<view class="detail-title">使用时间</view>
					<view class="detail-content">2020-11-30 00:00:00</view>
				</view>
			</view>
		</template>
		<!-- 显示兑换码 -->
		<view class="qrcode" @click="isShowCode = false" v-if="isShowCode">
			<view class="qrcode-body" @click.stop="stopEvent">
				<view class="qrcode-top">
					<view class="qrcode-h2">核销码</view>
					<view class="qrcode-h2">986532</view>
				</view>
				<view class="circle-box">
					<view class="circle-left"></view>
					<view class="circle-center"></view>
					<view class="circle-right"></view>
				</view>
				<view class="qrcode-bottom">
					<image class="qrcode-img" :src="qrCodeImgUrl" mode=""></image>
				</view>
			</view>
		</view>
		<canvas canvas-id="qrcode" class="canvas-hide" />
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	import {parseTime} from '@/common/filter.js'
	export default {
		components: {
		},
		data(){
			return {
				list: {
					identify: {title: '标识', content: '', copy:true, relo: [1]},
					name: {title: '名称', content: '', relo: [1,2]}, // 1:驾校，2：学员
					money: {title: '面额', content: '元', relo: [1,2]},
					count: {title: '总量', content: '', relo: [1]},
					startTime: {title: '开始时间', content: '', relo: [1,2]},
					endTime: {title: '结束时间', content: '', relo: [1,2]},
					duihuanma: {title: '兑换码', content: '',code:true, relo: [2]},
					received: {title: '已领取', content: '', relo: [1]},
					recycle: {title: '已核销', content: '', relo: [1]},
					instruction: {title: '使用说明', content: '', relo: [1,2]},
				},
				isShowCode: false,
				qrCodeImgUrl: '',
				relo: 2, // 1=发券用户，2=普通用户，根据不同用户分类显示不同数据
				id: 1,
			}
		},
		onLoad(options){
			console.log(options.id,options.usertype)
			this.id = options.id || 4;
			this.relo = ~~options.usertype;
			this.getInfo();
		},
		onReady() {
			this.makeQrCode();
		},
		methods: {
			getInfo(){
				this.$api.request('Activity/Coupon/getCouponInfoToWorker',{couponId:this.id}).then(res=>{
					console.log(res)
					
					let data = res.data;
					let list = this.list;
					list.identify.content = data.id;
					list.name.content = data.name;
					list.count.content = data.circulation;
					
					let recycle = data.writeoff_num > 0 ? data.writeoff_num / data.circulation * 100 : 0; // 计算已领取和已核销的百分比
					let received = data.has_num > 0 ? data.has_num / data.writeoff_num * 100 : 0;
					list.recycle.content = data.writeoff_num + '(' + recycle + '%)';
					list.received.content = data.has_num + '(' + received + '%)';
					list.startTime.content = parseTime(data.use_start_time);
					list.endTime.content = parseTime(data.use_end_time);
					list.instruction.content = data.instruction;
					// 标题或内容差异化处理
					if(data.type == 2){
						list.money.title = '折扣';
						list.money.content = data.discount / 10 + '折';
					}else{
						list.money.title = '面额';
						list.money.content = moneyTransform(data.discount,2) + '元';
					}
				})
			},
			openRule(){
				uni.navigateTo({
					url: 'rule_detail'
				})
			},
			showCode(){
				this.isShowCode = !this.isShowCode;
			},
			// 生成二维码
			makeQrCode(){
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: this.list.duihuanma.content,
					size: 220,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.errorCorrectLevel.H
				}).then(res=>{
					this.qrCodeImgUrl = res;
				})
			},
			stopEvent(){
				return false;
			},
			copy(text){
				uni.setClipboardData({
					data: text,
					success:()=>{
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				})
			}
		}
	}
	function moneyTransform(money,type){
		let o = {
			1: money * 100,
			2: money / 100
		}
		return o[type]
	}
	function calcTime(time){
		return time / 1000
	}
</script>

<style lang="scss" scoped>
.mpt30 {
	margin-top: 30rpx;
	padding-top: 30rpx;
}
.discount-body {
	display: flex;
	justify-content: center;
	flex-direction: column;
	margin: 20rpx 50rpx;
	font-size: 28rpx;
	background: #1E2135;
	border-radius: 16rpx;
}
.detail {
	display: flex;
	margin: 20rpx 30rpx;
	.in-right {
		width: 36rpx;
		height: 36rpx;
		margin-left: 100rpx;
	}
}
.detail-title {
	width: 160rpx;
	color: #B3B3BB;
}
.detail-content {
	flex: 1;
}
.rule {
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 112rpx;
	line-height: 112rpx;
	color: #B3B3BB;
	background: #25273C;
	border-radius: 0px 0px 16rpx 16rpx;
	margin-top: 30rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	
	.icon-arrow-right {
		color: #B3B3BB;
		font-size: 36rpx;
	}
}
// 二维码弹窗样式
.qrcode {
	box-sizing: border-box;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	.qrcode-body {
		margin-top: -150rpx;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
		.qrcode-top {
			background-color: #fff;
			padding: 20rpx;
		}
		.qrcode-bottom {
			background-color: #fff;
			padding: 48rpx 60rpx;
		}
		.qrcode-h2 {
			margin-bottom: 20rpx;
			font-size: 36rpx;
			color: #313131;
			text-align: center;
		}
		.qrcode-h2 + .qrcode-h2 {
			font-size: 60rpx;
			margin-bottom: 0;
		}
		.qrcode-content {
			color: #707070;
			line-height: 20px;
		}
	}
	.circle-box {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.circle-left {
		width: 20px;
		height: 20px;
		background-image: radial-gradient(circle farthest-side at 0 10px,transparent 10px,white 10px);
	}
	.circle-center {
		position: relative;
		flex: 1;
		height: 20px;
		background-color: #fff;
	}
	.circle-center::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		display: inline-block;
		width: 100%;
		height: 0;
		border-top: 1px dashed #C9C9CA;
	}
	.circle-right {
		width: 20px;
		height: 20px;
		background-image: radial-gradient(circle farthest-side at 20px 10px,transparent 10px,white 10px);
	}
	.qrcode-img {
		width: 220px;
	}
}
.canvas-hide {
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		z-index: -9999;
		opacity: 0;
		width: 220px;
		height: 220px;
}
.icon-lc-68 {
	font-size: 40rpx;
	text-shadow: 10rpx -10rpx 0 #787A86;
	border-radius: 8rpx;
}
</style>
