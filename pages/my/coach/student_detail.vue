<template>
	<view>
		<view class="" style="margin: 30rpx; border-radius:16rpx;overflow: hidden;" >
			<view  class="h_center pd15 jc_sb yylist" >
				<image :src="all.avatar?$realSrc(all.avatar):'/static/tx.png'" style="display: block;margin-right: 24rpx;width:72rpx;height:72rpx;border-radius: 50%;overflow: hidden;"></image>
				<view class="f_grow" >{{all.person_name}} 
				<text class="iconfont icon-lc-38" style="color:#6982fa" v-if="all.sex==1"></text>
				<text class="iconfont icon-lc-54" style="color:#ff6562" v-if="all.sex==2"></text>
				</view>
			</view>
		</view>
		<view class="box">
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">手机号：</text>
					<text class="f_grow line" >{{all.mobile}}</text>
				</view>
				<text class="iconfont icon-lc-46 colorb3" @click="call"></text>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">车型：</text>
					<text class="f_grow line">{{all.driving_type?'C1':'C2'}}</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">进度：</text>
					<text class="f_grow line">{{api.speed(all.speed)}}{{all.totaltime}}个学时</text>
				</view>
				<!-- <text class="iconfont icon-arrow-right colorb3"></text> -->
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">报名时间：</text>
					<text class="f_grow line">{{all.sign_time}}</text>
				</view>
			</view>
			<!-- <view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">分部：</text>
					<text class="f_grow line">{{all.school_name}}</text>
				</view>
			</view> -->
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">教练：</text>
					<text class="f_grow line">{{all.truename}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				api:this.$api,
				all:''
			}
		},
		onLoad(options) {
			this.id=options.id
			this.load()
		},
		methods: {
			load() {
				let that = this
				that.$api.request('User/Confirm/studentShow', {uid:that.id}).then(res => {
					that.all = res.data
				})
			},
			call(){
				uni.makePhoneCall({phoneNumber:this.all.mobile});
			}
		},
		onPullDownRefresh() {
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
.yylist{background-color: rgba(46,48,69,0.5);border-bottom:1px solid #191C2F;}
.yylist>view{font-size: 26rpx;color: #B3B3BB;}
.box{margin: 30rpx;padding: 15rpx;border-radius: 16rpx;overflow: hidden;background-color: #2E3045;}
.box_item{padding: 15rpx;}
.btn{width:208rpx;height:64rpx;background:#2E3045;border-radius:8rpx; float: right;margin-right: 30rpx;}
</style>
