<template>
	<view class="download-body">
		<view class="download-content">
			<image class="logo-img" src="@/static/logo.png" mode=""></image>
			<text>链车短视频</text>
			<view class="download-btn" type="default" @click="downloadApp">点此下载App</view>
			<view class="download-btn" type="default" @click="openApp" v-if="!isWeixin">点此打开App</view>
			<view class="download-btn" type="default" v-else>
				<text>点此打开App</text>
				<launchapp @error="openAppError" :extinfo="extinfo" launchId="launchApp" ></launchapp>
			</view>
		</view>
	</view>
</template>

<script>
	import {isWeixin,appid,isIos} from './comm.js'
	import {wxConfig} from '@/common/weixin.js'
	import launchapp from './launchApp.vue'
	export default {
		components: {
			launchapp
		},
		data(){
			return {
				isWeixin: isWeixin(),
				appid,
				extinfo: {},
				isIos: isIos()
			}
		},
		onLoad(options) {
			this.getAppInfo()
			if(this.isWeixin)	wxConfig()
		},
		onReady(){
			
		},
		methods: {
			getAppInfo(){
				let params = {
					platform: this.isIos ? 2 : 1,
					version:this.$api.config.version,
				};
				uni.request({
					url: this.$api.config.baseUrl + 'Main/Index/getApp', 
					data: params,
					success: (res) => {
						this.appDownloadUrl = res.data.data.pkgUrl;
					}
				});
			},
			downloadApp(){
				// 下载app
				if(this.appDownloadUrl){
					location.href = this.appDownloadUrl;
				}else{
					uni.showToast({
						title: '下载链接无效，请重试'
					})
				}
			},
			openApp(){
				location.href = "lianche://"
			},
			openAppError(e){
				const _this = this;
				if(_this.isIos){
					location.href = _this.appDownloadUrl
				}else{
					_this.openBrowerTip();
				}
			},
		}
	}
</script>

<style scoped>
page {
	width: 100%;
	height: 100%;
}
.view-body {
	position: fixed;
	left: 0;
	top: 0;
	background:-webkit-gradient(linear, left top, left bottom, from(#382b1e), to(black));
	width: 100%;
	height: 100%;
	font-size: 14px;
}
.header {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 9;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 50px;
	padding: 0 15px;
	background-color: rgba(0,0,0,.5);
	box-sizing: border-box;
}
.header-text {}
.header-btn-right {
	display: inline-block;
	width: 80px;
	height: 30px;
	line-height: 30px;
	border-radius: 15px;
	color: #fff;
	background-color: #fd418e;
	font-size: 12px;
	text-align: center;
	
}
.video-view {
	width: 100%;
	height: 100%;
}
.video-player {
	width: 100%;
	height: 100%;
}
.userinfo-view {
	position: absolute;
	left: 0px;
	bottom: 20px;
	width: 100%;
}
.userinfo-dec {
	position: relative;
	padding: 15px 24px 10px 80px;
}
.headimg {
	position: absolute;
	top: 10px;
	left: 20px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
}
.userinfo-dec-text {
	width: 100%;
	min-height: 37px;
}
.info-dec {
	width: 100%;
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.btn-group {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 5px 15px;
}
	
.attention-btn,.lookall-btn {
	flex: 1;
	margin: 5px;
	border-radius: 20px;
	background-color: orange;
	color: #fff;
}
.lookall-btn {
	background-color: #fd418e;
}

.download-body {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.download-content {
	margin-top: -100px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.logo-img {
	width: 100px;
	height: 100px;
	border-radius: 4px;
	margin-bottom: 10px;
}
.download-btn,.openapp-btn {
	position: relative;
	background-color: rgba(0,0,0,0);
	border: 1px solid orange;
	padding: 10px 30px;
	border-radius: 30px;
	color: #fff;
	font-size: 18px;
}
.download-btn {
	margin: 20px 0;
}
.video-hover {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,.1);
	display: flex;
	justify-content: center;
	align-items: center;
}
.playState {
	width: 128rpx;
	height: 128rpx;
	opacity: 0.4;
}
</style>