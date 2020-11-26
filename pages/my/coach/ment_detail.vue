<template>
	<view>
		<view class="" style="margin: 30rpx; border-radius:16rpx;overflow: hidden;" >
			<navigator hover-class="none" url="./ment_detail" class="h_center pd15 jc_sb yylist" >
				<image :src="all.avatar?$realSrc(all.avatar):'/static/tx.png'" style="display: block;margin-right: 24rpx;width:72rpx;height:72rpx;"></image>
				<view class="f_grow" >{{all.truename}} </view>
				<text class="iconfont icon-lc-38" style="color:#6982fa" v-if="all.sex==1"></text>
				<text class="iconfont icon-lc-54" style="color:#ff6562" v-if="all.sex==2"></text>
			</navigator>
		</view>
		<view class="box">
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">手机号：</text>
					<text class="f_grow line">{{all.mobile}}</text>
				</view>
				<text class="iconfont icon-lc-46 colorb3"></text>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">车型：</text>
					<text class="f_grow line">{{all.driving_type==1?'C1':'C2'}}</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">进度：</text>
					<text class="f_grow line">{{this.$api.speed(all.speed)}}</text>
				</view>
				<text class="iconfont icon-arrow-right colorb3"></text>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">时间：</text>
					<text class="f_grow line">{{all.batch_name}} {{all.start_time}}-{{all.end_time}}</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">分校：</text>
					<text class="f_grow line">{{all.school_name}}</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">教练：</text>
					<text class="f_grow line">{{all.coachs_truename}}</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item" @click="openLocation(all.latitude,all.longitude)">
				<view class="h_center f_grow">
					<text class=" colorb3">地点：</text>
					<text class="f_grow line">{{all.school_address}}</text>
				</view>
				<text class="iconfont icon-lc-21 colorb3"></text>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">创建时间：</text>
					<text class="f_grow line">{{all.create_time}}</text>
				</view>
			</view>
		</view>
		<view class="btn center" v-if="all.status==5" @click="cancel">
			确认取消
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				all:'',
				orderno:''
			}
		},
		onLoad(options) {
			this.orderno=options.orderno
			this.load()
		},
		methods: {
			load(){
				let that = this
				that.$api.request('Train/Appointment/coachsOrderShow', {orderno: this.orderno}).then(res => {
					that.all=res.data
				})
			},
			openLocation(lat,log){
				uni.openLocation({
					latitude: Number(lat),
					longitude: Number(log),
					success: function () {
						console.log('success');
					}
				});
			},
			cancel(){
				let that = this
				that.$api.request('Appointment/Appointment/coachsOrderCancel', {orderno: this.orderno}).then(res => {
					that.$api.Toast(res.msg)
					if(res.res==1){setTimeout(function () {uni.navigateBack({delta: 1})}, 1000) }
				})
			}
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
