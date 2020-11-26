<template>
	<view>
		<view class="" style="margin: 30rpx; border-radius:16rpx;overflow: hidden;" >
			<view  class="h_center pd15 jc_sb yylist" >
				<image class="headimg" :src="all.avatar?$realSrc(all.avatar):'/static/tx.png'"></image>
				<view class="f_grow ">
				<text class="coach-name">{{all.truename}} </text>
				<text class="iconfont icon-lc-38" style="color:#6982fa" v-if="all.sex==1"></text>
				<text class="iconfont icon-lc-54" style="color:#ff6562" v-if="all.sex==2"></text>
				</view>
			</view>
		</view>
		<view class="box">
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">手机号：</text>
					<text class="f_grow line">{{all.mobile}}</text>
				</view>
				<text class="iconfont icon-lc-46 colorb3" @click="call"></text>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">教龄：</text>
					<text class="f_grow line"> 教龄{{all.teach_age}}年</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">分部：</text>
					<text class="f_grow line">{{all.name}}</text>
				</view>
			</view>
			<view class="h_center jc_sb box_item">
				<view class="h_center f_grow">
					<text class=" colorb3">学员数：</text>
					<text class="f_grow line">{{all.students}}人</text>
				</view>
			</view>
		</view>
		<view class="btn center" @click="remove">剔除分部</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				all:{},
				api:this.$api,
				yt: 365 * 60 * 60 * 24 * 1000, // 一年的毫秒数,用于计算教龄
			}
		},
		onLoad(options) {
			this.uid=options.uid;
			this.id = options.id;
			this.load()
		},
		methods: {
			load() {
				let that = this
				that.$api.request('User/Confirm/coachsInfo', {coachsId:that.uid}).then(res => {
					// console.log(res)
					// 计算教龄
					// res.data.teaching_date = '2016-05'
					let stam = new Date().getTime() - new Date(res.data.teaching_date).getTime();
					
					res.data.teach_age = Math.ceil(Math.abs(stam) / that.yt); //向上取整
					console.log(res.data);
					that.all = res.data;
					
				})
			},
			call(){
				uni.makePhoneCall({phoneNumber:this.all.mobile});
			},
			remove(){
				this.$confirm({
					content: `确定把教练${this.all.truename}从分部剔除吗？`,
					confirm:()=>{
						this.$api.request('User/Confirm/confirmCoachsCancel',{id:this.id}).then(res=>{
							if(res.res === 1){
								uni.navigateBack();
							}
						})
					}
				})
			},
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
.headimg {display: block;margin-right: 24rpx;width:72rpx;height:72rpx;border-radius: 50%;overflow: hidden;}
.coach-name {color: #fff;font-size: 32rpx;}
</style>
