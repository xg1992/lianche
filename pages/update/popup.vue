<template>
	<view class="mask">
		<view @click.stop="onClick" class="content">
			<block v-if="isDownload">
				<view class="title">升级APP</view>
				<view class="progress">
					<view class="progress-title">正在为您更新，请耐心等待</view>
					<view class="progress-percent">已下载{{percent}}%</view>
					<c-progress :percent="percent"></c-progress>
				</view>
				<view class="btns">
					<view class="btn btn-default" @click.stop="cancelDownload">取消下载</view>
					<view class="btn btn-primary" @click.stop="background">后台下载</view>
				</view>
			</block>
			<block v-else>
				<view class="title">发现新版本{{version}}</view>
				<view class="desc">
					<text>{{desc}}</text>
				</view>
				<view class="btns">
					<view class="btn btn-default" @click.stop="cancelUpdate">暂不升级</view>
					<view class="btn btn-primary" @click.stop="download">立即升级</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import { compare } from "@/common/common.js"
	import cProgress from "@/components/c-progress/c-progress.vue"
	export default {
		components:{
			cProgress
		},
		data() {
			return {
				downloadTask:null,
				isDownload:false,
				percent:0,
				path:'',
				mode:0,
				version:'',
				desc:''
			}
		},
		onLoad() {
			this.checkUpdate()
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				return true
			}
		},
		methods: {
			// 检查更新，整包更新
			checkUpdate(){
				const res = uni.getSystemInfoSync();
				const platform = res.platform == 'android' ? 1 : res.platform == 'ios' ? 2 : 3; // 1:android, 2:ios, 3:其他
				this.$api.request('Main/Index/appStart',
					{
						platform: platform,
						deviceBrand: res.brand,
						deviceModel: res.model,
						systemVersion: res.system,
						appVersion: plus.runtime.version,
						deviceInfo: JSON.stringify(res)
					},
					'POST',
					false
				).then(res => {
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=> {
						console.log('当前版本：'+widgetInfo.version);
						console.log('服务器版本：'+res.data.appUpdate.version);
						if (compare(res.data.appUpdate.version, widgetInfo.version)) {
							this.desc = res.data.appUpdate.msg
							this.path = res.data.appUpdate.pkgUrl
							this.mode = res.data.appUpdate.mode
							this.version = res.data.appUpdate.version
						}else{
							uni.navigateBack()
						}
					})
				});
			},
			onClick(e) {
				// #ifdef APP-NVUE
				e.stopPropagation()
				// #endif
			},
			// 关闭弹窗
			close() {
				console.log(this.mode);
				if(!this.isDownload){
					if(this.mode==2){
						plus.runtime.quit()
					}else{
						uni.navigateBack()
					}
				}
			},
			// 下载
			download(){
				if(this.isDownload){
					return
				}
				if(uni.getSystemInfoSync().platform == 'ios'){
					plus.runtime.openURL('itms-apps://' + 'itunes.apple.com/cn/app/wechat/id1513086687');
					return
				}
				this.isDownload = true
				this.downloadTask = uni.downloadFile({
				    url: this.path,
				    success: (res) => {
				        if (res.statusCode === 200) {
							this.isDownload = false
				            console.log('下载成功');
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: (result) => {
									console.log('文件保存成功');
									plus.runtime.install(result.savedFilePath, { force: true },()=>{
										console.log('安装成功');
									},err=>{
										console.log('安装失败:'+JSON.stringify(err));
									})
								}
							})
				        }
				    }
				})
				
				this.downloadTask.onProgressUpdate((res) => {
				    // console.log('下载进度' + res.progress);
				    // console.log('已经下载的数据长度' + res.totalBytesWritten);
				    // console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
					this.percent = res.progress
				});
			},
			// 取消更新
			cancelUpdate(){
				this.isDownload = false
				this.close()
			},
			// 取消下载
			cancelDownload(){
				uni.showModal({
					content:'新版本马上下载完成，确定取消吗？',
					cancelText:'继续下载',
					confirmText:'取消下载',
					success: (res) => {
						if(res.confirm){
							this.downloadTask.abort()
							this.cancelUpdate()
						}
					}
				})
			},
			// 后台下载
			background(){
				this.isDownload = false
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.content {
		padding: 30rpx 0;
		width: 600rpx;
		
		border-radius: 16rpx;
		background-color: #ffffff;
	}

	.title{
		@include font(34rpx,#313131,bold);
		text-align: center;
		height: 60rpx;
	}
	.desc{
		padding: 30rpx;
		min-height: 200rpx;
		max-height: 600rpx;
		overflow-y: scroll;
		padding-bottom: 0;
		color: #313131;
		line-height: 60rpx;
	}
	.progress{
		margin: 0 20rpx;
		margin-top: 60rpx;
	}
	.progress-title{
		text-align: center;
		@include font(28rpx,#313131,bold);
	}
	.progress-percent{
		text-align: center;
		@include font(28rpx,#F6A704,bold);
		margin: 40rpx 0;
	}
	.btns{
		margin-top: 60rpx;
		@include fr(b,c);
	}
	.btn{
		height: 80rpx;
		border-radius: 8rpx;
		line-height: 80rpx;
		text-align: center;
		flex-grow:1;
		margin: 0 20rpx;
	}
	.btn-default{
		@include font(28rpx,#8D8D8D);
		background-color: #FFFFFF;
		border: 1px solid #e9e9f1;
	}
	.btn-primary{
		@include font(28rpx,#FFFFFF);
		background-color: #F6A704;
	}
</style>
