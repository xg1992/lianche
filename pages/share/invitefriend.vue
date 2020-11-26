<template>
	<view class="content">
		<view class="banner" @click="download">
			<view class="header">
				<view class="logo-box">
					<image class="logo" src="@/static/logo.png" mode=""></image>
					<text class="appname">链车短视频</text>
				</view>
				<view class="publicity-text">每个教练都有自己的品牌</view>
			</view>
			<view class="h_center jc_sb" style="padding: 40rpx 30rpx;" v-if="all.nickname">
				<view class="posre" style="margin-right: 25rpx;">
					<image :src="all.avatar ? all.avatar + '?time=' + new Date().getTime() : '/static/tx.png'" mode="" style="width: 146rpx;height:146rpx;border-radius: 50%;"></image>
					<text class="coach_icon" v-if="all.roleVal & 16">教练</text>
					<text class="student_icon" v-if="all.roleVal & 8">学员</text>
				</view>
				<view class="f_grow">
					<view class="">
						<text class="font36 bold">
							{{ all.nickname }}
							<text class="iconfont icon-lc-38" style="color:#6982fa" v-if="all.sex == 1"></text>
							<text class="iconfont icon-lc-54" style="color:#ff6562" v-if="all.sex == 2"></text>
						</text>
						<text class="user_icon" v-if="all.roleVal & 16">教龄 {{ all.ofSchoolAge>0?all.ofSchoolAge:0 }} 年</text>
					</view>
					<view class="font26 colorb3" style="margin-top: 20rpx;">链车号：{{ all.username }}</view>
					<!-- <view class="font26 colorb3 grace-ellipsis" style="margin-top: 10rpx; width: 340rpx;" v-if="all.roleVal & 16 && all.ofSchoolAge">驾校：广州永通驾校</view> -->
				</view>
				<view class="gzbtn center" >
					<text>关注</text>
					<launchapp @error="openAppError" :extinfo="extinfo" launchId="launchApp" v-if="all.username"></launchapp>
				</view>
			</view>
		</view>
		<view class="invite-code-view" v-if="all.inviteCode">
			<view class="invite-code-box">
				<view class="invite-title">我的邀请码</view>
				<view class="invite-code">{{all.inviteCode}}</view>
			</view>
			<view class="invite-btn-box">
				<button type="default" class="invite-btn" @click="copyCode">复制</button>
			</view>
		</view>
		<view class="" @click="download">
			<image class="publicity-img" src="@/static/publicity.jpg" mode=""></image>
		</view>
		<view class="download-view" @click="download"><button class="download-btn-inwx" >点此下载App</button></view>
		<browerTip ref="browerTip"></browerTip>
	</view>
</template>

<script>
	import browerTip from './BrowerTip.vue'
	import launchapp from './launchApp.vue'
	import {wxConfig} from '@/common/weixin.js'
	import {getAppInfo,isWeixin,isIos} from './comm.js'
	export default {
		components:{
			browerTip,
			launchapp
		},
		data() {
			return {
				all: {},
				isWX: true,
				extinfo: {
					"path":"/pages/homepage/homepage?",
					"openType":"navigate",
				}, // 跳转app携带的参数
				isIos: isIos(),
				appDownloadUrl: '',
				isWeixin: isWeixin()
			}
		},
		onLoad(options) {
			if(!this.isWeixin){
				uni.redirectTo({
					url: `/pages/share/download`
				})
			}else{
				this.extinfo.path = `${this.extinfo.path}uid=${options.uid}`;
				this.extinfo = JSON.stringify(this.extinfo)
				this.id = options.uid;
				this.load();
				getAppInfo(this);
				wxConfig()
			}
		},
		methods: {
			load() {
				console.log(this.id);
				let that = this;
				that.$api.request('Video/Homepage/homepageUserinfo', {
					uid: this.id
				}).then(res => {
					that.all = res.data;
					that.all.avatar = this.$realSrc(res.data.avatar)
				});
			},
			// 复制邀请码
			copyCode(){
				if(this.all.inviteCode){
					let text = this.all.inviteCode + '';
					uni.setClipboardData({
						data:text,
						success:()=> {
							uni.showToast({
								title:"复制成功",
								icon:"none"
							})
						}
					})
				}else{
					uni.showToast({
						title:"邀请码不存在",
						icon:"none"
					})
				}
			},
			download(){
				if(this.isWeixin){
					if(this.isIos){
						location.href = this.appDownloadUrl
					}else{
						this.openBrowerTip();
					}
				}
			},
			openBrowerTip(){
				this.$refs.browerTip.openTip();
			},
			// 判断安卓
			isAndroid() {
			    let u = navigator.userAgent;
			    if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
			        if (window.ShowFitness !== undefined) return true;
			    }
			    return false;
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
		color: #333;
		height: 100%;
	}
	.content {
		background-color: #fff;
	}
	.h_center {
		width: 80%;
		margin: 0 auto;
		background-color: rgba(165,42,42,.8);
		border-radius: 20rpx 20rpx 0 0;
	}
	.coach_icon {
		position: absolute;
		bottom: 0;
		border-radius: 12rpx;
		background-color: #ff6562;
		font-size: 16rpx;
		left: 0;
		right: 0;
		margin: auto;
		width: 56rpx;
		height: 24rpx;
		line-height: 24rpx;
		text-align: center;
		padding: 4rpx 0;
		box-sizing: border-box;
	}

	.student_icon {
		position: absolute;
		bottom: 0;
		border-radius: 12rpx;
		background-color: #6982fa;
		font-size: 16rpx;
		left: 0;
		right: 0;
		margin: auto;
		width: 56rpx;
		height: 24rpx;
		line-height: 24rpx;
		text-align: center;
		padding: 4rpx 0;
		box-sizing: border-box;
	}

	.user_icon {
		padding: 7rpx 13rpx;
		font-size: 20rpx;
		color: #b3b3bb;
		border: 1rpx solid #b3b3bb;
		border-radius: 8rpx;
		margin-left: 17rpx;
	}

	.gzbtn {
		position: relative;
		width: 120rpx;
		height: 64rpx;
		background: #f6a704;
		border-radius: 8rpx;
		overflow: hidden;
	}
	.banner {
		background-color: rgb(250,68,81);
		border-radius: 0 0 52rpx 52rpx;
	}
	.header {
		padding: 60rpx 0 30rpx;
	}

	.logo-box {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logo {
		width: 60rpx;
		height: 60rpx;
		border-radius: 16rpx;
	}

	.appname {
		margin-left: 10rpx;
		font-size: 52rpx;
	}

	.publicity-text {
		margin: 30rpx 0;
		text-align: center;
	}
	.publicity-img {
		width: 741rpx;
		height: 1470rpx;
	}
	.download-view {
		padding: 30rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
	}
	.download-btn-inwx {
		background-color: rgb(73,76,107);
		color: #fff;
	}
	.content {
		padding-bottom: 180rpx;
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
	/* 邀请码 */
	.invite-code-view {
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 30rpx 30rpx 0 80rpx;
	}
	.invite-title {
		color: #191C2F;
		font-size: 28rpx;
	}
	.invite-code{
		color: rgb(73,76,107);
		font-size: 52rpx;
		font-weight: bold;
	}
	.invite-btn {
		width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		border: 1px solid #F8515B;
		border-radius: 32rpx;
		background-color: transparent;
		color: #F8515B;
	}
	.invite-btn-box {
		margin-left: 80rpx;
	}
</style>
