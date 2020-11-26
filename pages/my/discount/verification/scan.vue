<template>
	<view class="rule-detail">
		<view class="rule-detail-body">
			<view class="rule-top">
				<view class="input_parent">
					<input type="number" v-model="qrCodetext" placeholder="请输入核销码" class="font16 input_bg" name='code'
					 maxlength="6" />
	
					<view class="iconfont icon-scan input_scan" @click="scan" />
				</view>
			</view>
			<view class="circle-box">
				<view class="circle-left"></view>
				<view class="circle-center"></view>
				<view class="circle-right"></view>
			</view>
			<view class="rule-bottom">
				<view class="rule-detail-h2">
					操作步骤引导：
				</view>
				<view class="rule-content">
					<view><text class="serial">1</text> 请顾客出示卡券或二维码</view>
					<view><text class="serial">2</text> 请输入优惠码或者点击右侧扫描标识 </view>
					<view><text class="serial">3</text> 点击确认核销</view>
					<view><text class="serial">4</text> 验证完成，查看使用结果</view>
				</view>
			</view>
		</view>
		<button formType="submit" class="btn font14 center" @click="confirm">确认核销</button>
		
		<lcDialog ref="dialog" :isCloseBtn="false" :isBtns="false" @confirm="confirm">
			<template v-slot:content >
				<view class="dialog-body">
					<view><text class="iconfont icon-lc-30"></text></view>
					<view class="">优惠券核销成功</view>
					<view class="close-btn" @click="close">关闭</view>
				</view>
			</template>
		</lcDialog>
	</view>
</template>

<script>
	import lcDialog from '@/components/lcDialog.vue'
	export default {
		components: {
			lcDialog
		},
		data(){
			return {
				qrCodetext: '',
			}
		},
		methods: {
			scan() {
				console.log("扫描")
				// 允许从相机和相册扫码
				uni.scanCode({
				    success: (res)=>{
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
								this.qrCodetext = res.result;
				    }
				});
			},
			confirm() {
				console.log("确认核销")
				this.$refs.dialog.open();
				if(!this.qrCodetext){
					uni.showToast({
						title: '请填写核销码',
						icon: 'none',
						duration: 3000,
					})
					return ;
				}
				// 获取经纬度，记录核销地点
				uni.getLocation({
					type: 'gcj02',
					success:(res)=> {
						console.log(res)
					}
				})
				this.$api.request('url',{code:this.qrCodetext}).then(res=>{
					if(res.res === 1){
						this.$refs.dialog.open();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 3000,
						})
					}
				})
			},
			close(){
				this.$refs.dialog.hide();
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

.rule-detail-body {
	position: relative;
	width: 100%;
	border-radius: 20rpx;
	overflow: hidden;
}

.rule-top,
.rule-bottom {
	background-color: #2E3045;
	padding: 60rpx 30rpx;
}
.rule-bottom {
	padding: 30rpx 30rpx 30rpx 60rpx;
}

.rule-content {
	color: #B3B3BB;
	background-image: linear-gradient(to right,#3A3C55,#3A3C55);
	background-size: 1px calc(100% - 50rpx);
	background-position: 18rpx 40rpx;
	background-repeat: no-repeat;
	.serial {
		display: inline-block;
		width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
		text-align: center;
		border-radius: 50%;
		background-color: #494C6A;
		margin: 40rpx 24rpx 0 0;
	}
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
		background: #2E3045;
	}
	.circle-right {
		position: relative;
		width: 15px;
		height: 20px;
		background-image: radial-gradient(circle farthest-side at 15px 10px, transparent 10px, #2E3045 10px);
	}
}
.btn {
	width: 100%;
	margin: auto;
	height: 88upx;
	background-color: #F6A704;
	border-radius: 16upx;
	color: white;
	margin-top: 160upx
}

.input_parent {
	position: relative;
	width: 100%;
}

.input_bg {
	width: 100%;
	height: 112upx;
	background-color: #FFF;
	border-radius: 16upx;
	color: #313131;
	padding-left: 20rpx;
	font-weight: bold;
}

.input_scan {
	position: absolute;
	right: 24rpx;
	top: 34rpx;
	font-size: 44rpx;
	color: #B3B3BB
}
.dialog-body {
	text-align: center;
	padding-top: 30rpx;
	font-size: 36rpx;
	& > view {
		color: #333;
	}
	.icon-lc-30 {
		font-size: 104rpx;
		color: #F6A704;
		margin-bottom: 20rpx;
	}
	.close-btn {
		margin-top: 80rpx;
		height: 104rpx;
		line-height: 104rpx;
		color: #fff;
		background-color: #F6A704;
	}
}

</style>
