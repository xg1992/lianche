<template>
	<view class="view-body" >
		<view class="header">
			<text class="header-text">链车短视频，新鲜短视频看不停</text>
			<view class="header-btn-right" >
				<text>打开看看</text>
				<launchapp @error="openAppError" :extinfo="extinfo" launchId="launchApp1" v-if="list.nickname"></launchapp>
			</view>
		</view>
		<!-- 视频 -->
		<view class="video-view" @click="playOfpause">
			<jVideo ref="videoPlay" :state="playState" :src="list.video" :poster="$realSrc(list.avatar)" :hfiveObjectFit="objectFit" :boxStyle="boxStyle" :videoInfo="{}" @play="startPlay"></jVideo>
			<view class="video-hover" v-if="!isClicked">
				<image class="video-cover" :mode="imageMode" :src="$realSrc(list.cover)"></image>
			</view>
			<view class="video-hover" v-if="playState == 'pause'">
				<image class="playState" src="@/static/img/index/play.png"></image>
			</view>
		</view>
		<!-- 视频所有者信息 -->
		<view class="userinfo-view">
			<view class="userinfo-dec">
				<image class="headimg" :src="list.avatar ? $realSrc(list.avatar) : '@/static/tx.png'" mode=""></image>
				<view class="userinfo-dec-text">
					<view>{{list.nickname}}</view>
					<view class="info-dec">{{list.title}}</view>
				</view>
				<launchapp  @error="openAppError" :extinfo="extinfo2" launchId="launchApp4" v-if="list.nickname"></launchapp>
			</view>
			<view class="btn-group">
				<view class="attention-btn">
					<text>关注TA</text>
					<launchapp  @error="openAppError" :extinfo="extinfo2" launchId="launchApp2" v-if="list.nickname"></launchapp>
				</view>
				<view class="lookall-btn">
					<text>看TA的全部视频</text>
					<launchapp  @error="openAppError" :extinfo="extinfo2" launchId="launchApp3" v-if="list.nickname"></launchapp>
				</view>
			</view>
		</view>
		<!-- 选择其他浏览器打开提示 -->
		<browerTip ref="browerTip"></browerTip>
	</view>
</template>
<script>
	
	import jVideo from "@/components/j-video/j-video.nvue"
	import browerTip from './BrowerTip.vue'
	import {wxConfig} from '@/common/weixin.js'
	import launchapp from './launchApp.vue'
	import {appid,getAppInfo,isIos} from './comm.js'
	export default {
		components:{
			jVideo,
			browerTip,
			launchapp
		},
		data(){
			return {
				playState: 'pause',
				list: {},
				showBrowerTip: false,
				boxStyle: {width:'100%',height:uni.getSystemInfoSync().windowHeight+'px'},
				appid,
				extinfo: {
					"path":"/pages/video/video?act=Video/Works/myVideo",
					"openType":"navigate",
				},
				extinfo2: {
					"path":"/pages/homepage/homepage",
					"openType":"navigate",
				},
				appDownloadUrl: '', // app下载链接
				isIos: isIos(), // ios还是安卓
				isClicked: false, // 是否已经播放过视频，播放视频则隐藏封面图
				imageMode: 'scaleToFill',
				objectFit: 'fill'
			}
		},
		onLoad(options) {
			if(!this.isWeixin()){
				uni.redirectTo({
					url: `/pages/share/download?route=pages/video/video&uid=${options.uid}&videoId=${options.video_id}`
				})
			}else{
				if(options.video_id) this.videoId = options.video_id;
				this.load()
			}
			getAppInfo(this)
			// 使用微信开放标签权限配置
			wxConfig()
		},
		// onReady() {
		// 	this.onevent();
		// },
		methods: {
			load(){
				// 获取视频信息
				this.$api.request('User/Confirm/getVideo',{
					video_id: this.videoId
				}).then(res=>{
					if(res.res === 1){
						this.extinfo.path = `${this.extinfo.path}&currentVideoId=${this.videoId}&uid=${res.data.uid}`;
						this.extinfo = JSON.stringify(this.extinfo);
						this.extinfo2.path = `${this.extinfo2.path}?uid=${res.data.uid}`;
						this.extinfo2 = JSON.stringify(this.extinfo2)
						this.list = res.data;
						this.playState = 'pause';
						if(this.list.height / this.list.width < 1.5){
							this.imageMode = 'aspectFit';
							this.objectFit = 'contain';
						}
						this.$nextTick(()=>{
							this.onevent();
						})
					}
				})
			},
			openBrowerTip(){
				this.$refs.browerTip.openTip();
			},
			//检查是否微信浏览器
			isWeixin() {
				var ua = navigator.userAgent.toLowerCase();
				var isWeixin = ua.indexOf('micromessenger') != -1;
				if (isWeixin) {
					return true;
				}else{
					return false;
				}
			},
			playOfpause(){
				if(this.playState === 'play'){
					this.playState = 'pause';
				}else{
					this.playState = 'play';
				}
			},
			openAppError(e){
				const _this = this;
				if(_this.isIos){
					location.href = _this.appDownloadUrl
				}else{
					_this.openBrowerTip();
				}
			},
			onevent(){
				let _this = this;
				const btn = document.getElementById('launchApp');
				btn.addEventListener('error',function(e){
					_this.openAppError(e)
				})
			},
			startPlay(){
				// 开始播放视频,移除封面
				if(!this.isClicked) this.isClicked = true;
			}
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
	position: relative;
	display: inline-block;
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	background-color: #ff23ab;
	overflow: hidden;
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
	top: 5px;
	left: 15px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
}
.userinfo-dec-text {
	width: 100%;
	min-height: 37px;
	color: #fff;
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
	position: relative;
	flex: 1;
	margin: 5px;
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 36rpx;
	font-size: 28rpx;
	text-align: center;
	background-color: orange;
	overflow: hidden;
}
.lookall-btn {
	background-color: #ff23ab;
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
	background-color: rgba(0,0,0,0);
	border: 1px solid orange;
	padding: 0 30px;
	border-radius: 30px;
	color: #fff;
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
.launch-btn {
	padding: 20rpx 30rpx;
	border-radius: 8rpx;
	background-color: #00B3FF;
	color: #fff;
	margin: 20rpx;
}
.wh-launch-2 {
	position: absolute;
	top: 0;
	left: 10px;
	width: 100%;
	height: 100%;
	background-color: transparent;
	overflow: hidden;
}
.video-cover {
	width: 100%;
	height: 100%;
}
</style>