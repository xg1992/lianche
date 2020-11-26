<template>
	<view>
		<view class="inv_header">
			<image src="../../static/yaoqing.png" style="width: 100%;height: 100%;"></image>
			<view class="inv_sm center" @click="open">邀请说明</view>
			<view class="h_center jc_sb pd15" style="position: absolute;bottom:-120rpx;width: 100%;box-sizing: border-box;">
				<view class="inv_block">
					<text>邀请朋友</text>
					<text>+150奖励金</text>
					<text>&zwnj;</text>
				</view>
				<view class="inv_block">
					<text>邀请分部</text>
					<text>+1000奖励金</text>
					<text>+0.7%收益</text>
				</view>
				<view class="inv_block">
					<text>邀请总部</text>
					<text>+1500奖励金</text>
					<text>+0.7%收益</text>
				</view>
			</view>
		</view>
		
		<view class="pd15" style="margin-top: 100rpx;">
			<view class="inv_list">
				<view class="h_center jc_sa nav_box">
					<view class="center color8d " :class="type==1?'nav_active':''" @click="nav(1)">邀请的朋友</view>
					<view class="center color8d " :class="type==2?'nav_active':''" @click="nav(2)">邀请的分部</view>
					<view class="center color8d " :class="type==3?'nav_active':''" @click="nav(3)">邀请的总部</view>
				</view>
				<view class="pd15">
					<view class="h_center jc_sa list font24 colorb3" style="text-align: center;">
						<text style='width:20%'>用户</text>
						<text style='width:50%'>时间</text>
						
						<text style='width:20%'>验证</text>
					</view>
					<view class="h_center jc_sa list font24" style="color:#3A3C55" v-for="(item,idx) in list" :key='idx'>
						<text style='width:20%'>{{item.receive_truename}}</text>
						<text style='width:50%'>{{item.create_time}}</text>

						<text style='width:20%'>{{item.confirm_status==-1?'不确认':""}}{{item.confirm_status==0?'未确认':""}}{{item.confirm_status==1?'已确认':""}}
						</text>
					</view>
					
				</view>
			</view>
		</view>
		<!--  -->
		<popup ref="popup" type="center"  :mask-click="true">
			<view class="popup_tip">
				<view class="iconfont icon-lc-39 gbbtn" @click="close"></view>
				<view class="font36 bold color33 pd15 center">邀请说明</view>
				<view class="pd15">
					<text style="color:#191C2F">
						邀请朋友：邀请朋友后，朋友成功登录，则可以获取对应的奖励金。
						
						邀请分部或总部：邀请分部或总部后，该负责人在平台提交资质认证，认证成功后，则可以获取对应的奖励金。
						
						注意:成功邀请一个分部或总部（分部或总部负责人），并且认证分部或总部成功，您可以获取该分部或总部旗下教练和学员商城上线后一年的（月结）商城消费总额的0.7%的收益；
					</text>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	import Popup from "@/components/Popup.vue"
	export default {
		components: {Popup},
		data() {
			return {
				type:1,
				page:1,
				list:'',
			}
		},
		onLoad() {
			this.nav(1);
		},
		methods: {
			nav(e){
				this.type=e
				this.list=''
				this.page=1
				let that = this
				
				that.$api.request('User/Confirm/invitationList', {
					page: 1,
					pagesize: 10,
					type: that.type,
					
					}).then(res => {
					that.list=res.data
					// console.log(res)
				})
				
			},
			open(){
				this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
			},
		},
		onReachBottom() {
			let that = this
			that.$api.request('User/Confirm/invitationList', {
				page: that.page+1,
				pagesize: 10,
				type: that.type,
				
				}).then(res => {
				var  content = that.list.concat(res.data);
				that.list = content;
				if(res.data){that.page=that.page+1}
			})
		}
	}
</script>

<style>
	page{background-image: linear-gradient(#FF7C26, #FF8325);}
.inv_header{position: relative;height: 559rpx;}
.inv_sm{width:133rpx;height:56rpx;background:#FF9E1B;border-radius:28rpx 0px 0px 28rpx;font-size: 24rpx;color:#FF2502;position: absolute;right: 0;top: 53rpx;}
.inv_block{display: flex;align-items: center;flex-direction: column;justify-content: center;width:218rpx;height:216rpx;background:#FFDF56;border-radius:16rpx;}
.inv_block text:first-child{font-size: 40rpx;color:#FF2502;font-weight: bold;}
.inv_block text:nth-child(2){font-size: 30rpx;color:#AE2224;padding:12rpx 0;}
.inv_block text:nth-child(3){font-size: 30rpx;color:#FF2502}
.inv_list{background-color: white;border-radius:16rpx;}
.nav_box{height:120rpx;}
.nav_box>view{height: 100%;flex-grow: 1;}
.nav_active{color: #FF2502;position: relative;}
.nav_active:after{content:'';display: block;width:125rpx;height:4rpx;background:#FF2502;border-radius:2rpx;position: absolute;bottom: 10rpx;left:0;right:0;margin:auto}
.list{background:#F7F6F5;border-radius:16rpx;height: 80rpx;text-align: center;}
.popup_tip{width: 80%;background-color: #FFFFFF;border-radius: 16rpx;position: fixed;left: 50%;top: 50%;
transform: translate(-50%, -50%);margin: auto;}
.gbbtn{position: absolute;right:0;top:-10%;font-size:39rpx;color:#B3B3BB}
</style>
