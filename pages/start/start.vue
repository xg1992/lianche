<template>
	<view>
		<!-- 页面功能区域 启动页关闭后再展示 -->
		<view class="grace-body" v-if="!startBannerShow">
			<!-- 根据项目真实需求 自行编写 -->
			<view class="btn_box">
				<view class="center mgto40">
					啊哦~~(灬ꈍ ꈍ灬)数据有误
				</view>
				<navigator hover-class="none" url="/pages/shortvideo/shortvideo"  open-type="switchTab" class="btn">返回首页</navigator>
			</view>
			
		</view>
		<!-- 启动广告 -->
		<view class="gui-start-banner" v-if="startBannerShow">
			<view class="gui-start-banner-skip" @tap.stop="closeStartBanner">{{count}}s跳过</view>
			<swiper 
			:indicator-dots="true" indicator-active-color="#b85949" indicator-color="#b2b89b" 
			:autoplay="false" :style="{height:startBannerHeight+'px'}">
				<!-- 启动图片建议纯色背景 此处设置 swiper-item 背景颜色与图片背景颜色相同即可实现全屏效果 -->
				<swiper-item style="background-color:#000;height: 100%;" v-for="(i,idx) in urls" :key='idx'>
					<image :src="$realSrc(i)" style="width: 100%;height: 100%;" mode="aspectFit"></image>
					<view class="gui-start-banner-close" @tap.stop="closeStartBanner" v-if="idx==urls.length-1">开始体验</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
var graceSysInfo = require("../../graceUI/jsTools/systemInfo.js");
import config from "../../config/index.js"
export default {
    data(){
        return {
			startBannerShow : true,
			startBannerHeight : 716,
			urls:[],
			count:30,
			timer: null,
		}
    },
    onLoad:function(){
		let that=this
		let startBannerShow = uni.getStorageSync("startBannerShow");
		if (startBannerShow !== ''&&that.$api.storage('SystemInfo')!=='') {
			uni.switchTab({
				url: '/pages/shortvideo/shortvideo',
				animationType: 'zoom-fade-out',
				animationDuration: 200
			});
		}else{
			// 读取本地数据 gui-start-banner 判断用户是否第一次使用 app
			// 来决定是否展示启动广告
			const res = uni.getSystemInfoSync();
			that.$api.storage('SystemInfo', res)
			// ，1:android, 2:ios, 3:其他
			let platform = res.platform == 'android' ? 1 : (res.platform == 'ios' ? 2 : 3)
			that.$api.request('Main/Index/appStart', {
				platform: platform,
				deviceBrand: res.brand,
				deviceModel: res.model,
				systemVersion: res.system,
				appVersion: config.version,
				deviceInfo: JSON.stringify(res)
			}, 'POST', false).then(res => {
				let starturls=res.data.appIntroduction.images
				if(starturls){
					that.urls=starturls
					var system = graceSysInfo.info();
					that.startBannerHeight = system.windowHeight;
					that.startBannerShow = true;
					const TIME_COUNT = 30;
					if (!that.timer) {
						that.count = TIME_COUNT;
						that.timer = setInterval(() => {
							if (that.count > 0 && that.count <= TIME_COUNT) {
								that.count--;
							} else {
								clearInterval(that.timer);
								that.timer = null;
								that.closeStartBanner()
							}
						}, 1000)
					}
				}else{
					clearInterval(that.timer);
					that.timer = null;
					that.closeStartBanner()
					that.startBannerShow = false;
				}
				// var startBannerShow = uni.getStorageSync("startBannerShow");
				// if(startBannerShow == '' || !startBannerShow){
					
				// }else{
					
				// 	that.startBannerShow = false;
				// }
				
			})
		}
		
		
	},
    methods:{
		closeStartBanner : function(){
			let that=this
			this.startBannerShow = false;
			clearInterval(that.timer);
			that.timer = null;
			uni.setStorageSync('startBannerShow', false);
			uni.switchTab({
			    url: '/pages/shortvideo/shortvideo'
			});
			//此处使用 uni.setStorageSync() 设置 startBannerShow = 'ishow';
			// 下次启动 app 时将不再展示启动广告
		}
	}
}
</script>
<style>
.gui-start-banner-skip{width:100rpx; height:50rpx; border-radius:50rpx; text-align:center; border:1px solid white; color:white; font-size:22rpx; line-height:50rpx; position:absolute; z-index:9999; top:120rpx; right:50rpx;}
.gui-start-banner{width:100%; position:fixed; z-index:9998; top:0; left:0; bottom:0;}
.gui-start-banner swiper{width:100%; height:500rpx; background-color:#000;}
.gui-start-banner swiper-item{width:100%; display:flex; flex-direction: column; justify-content:center; align-items:center; font-size:0;}
.gui-start-banner swiper-item image{width:100%;}
.gui-start-banner-close{width:220rpx; height:80rpx; border-radius:80rpx; text-align:center; border:1px solid white; color:white; font-size:28rpx; line-height:80rpx;position: fixed;bottom: 5%;left: 0;right:0;margin:auto;}
.btn{width:220rpx; height:80rpx;border-radius:80rpx; text-align:center; border:1px solid #F97D7C; color:#F97D7C; font-size:28rpx; line-height:80rpx;margin:100rpx  auto;}
.btn_box{position: fixed;left: 0;right: 0;top: 0;bottom: 0;margin: 0 auto;top: 50%;transform: translateY(-50%);}
</style>