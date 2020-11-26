<template>
	<view>
		<image src="../../static/logo.png" style="width: 128rpx;height: 128rpx;margin: 56rpx auto 26rpx auto;display: block;"></image>
		<view class="center">v{{version}}</view>
		<view class="pd15 h_center jc_sb botom" @click="openStoreApp" v-if="isIos">
			<text>去评分</text>
			<view class="right-arrow"></view>
		</view>
		<navigator class="pd15 h_center jc_sb botom" hover-class="none"  url="fun_introduce">
			<text>功能介绍</text>
			<view class="right-arrow"></view>
		</navigator>
		<view class="pd15 h_center jc_sb botom" @tap="checkUp">
			<text>检查更新</text>
			<view class="right-arrow"></view>
		</view>
		<navigator class="pd15 h_center jc_sb botom" hover-class="none" url="synopsis">
			<text>简介</text>
			<view class="right-arrow"></view>
		</navigator>
		
		<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;font-size: 24rpx;color:#B3B3BB;line-height:48rpx;position: fixed;bottom: 5%;left: 0;right: 0;margin: auto;">
			<text @click="open">《用户服务协议》</text>
			<text>广州链车信息技术有限公司版权所有</text>
			<!-- <text>粤ICP备66666666号-1 © 2019</text> -->
		</view>
		
		<Popup ref="popup" type="center">
			<view class="popup_tip">
				<view class="iconfont icon-lc-39 gbbtn" @click="close"></view>
				<!-- <view class="font36 bold color33 pd15 center">服务条款</view> -->
				<view class="pd15 colorb3">
					<scroll-view class="scroll-view_H" scroll-y="true" style="height: 900rpx;">
						<rich-text :nodes="content"></rich-text>
					</scroll-view>
		
				</view>
			</view>
		
		</Popup>
	</view>
</template>

<script>
	import { checkUpdate } from '@/common/update.js'
	import Popup from "@/components/Popup.vue"
	import {agreement} from '../login/agreement.js'
	export default {
		components: {
			Popup
		},
		data() {
			return {
				version:plus.runtime.version,
				isIos: uni.getSystemInfoSync().platform === 'ios' ? true : false,
				content: ''
			}
		},
		async onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=> {
				this.version = widgetInfo.version
			})
			this.content = agreement;
		},
		methods: {
			checkUp(){
				checkUpdate().then(res=>{
					uni.showToast({
						title:'当前已是最新版',
						icon:'none'
					})
				})
			},
			openStoreApp(){
				plus.runtime.openURL('itms-apps://' + 'itunes.apple.com/cn/app/wechat/id1513086687');
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
		}
	}
</script>

<style scoped>
	.popup_tip {
		width: 80%;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		margin: auto;
	}
	.gbbtn {
		position: absolute;
		right: 0;
		top: -50rpx;
		font-size: 39rpx;
		color: #B3B3BB
	}
</style>
