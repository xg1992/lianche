<template>
	<view class="container">
		<image class="bg" src="../../static/images/invatation_bg.png" mode="widthFix"></image>
		<view class="invitation">
			<view class="invitation-bg"></view>
			<view class="invitation-main">
				<view class="invitation-main-left">
					<view class="invitation-main-left-title">我的邀请码</view>
					<view class="invitation-main-left-code">{{info.inviteCode}}</view>
				</view>
				<view class="invitation-main-right">
					<view class="btn btn-share" @click="share">分享给好友</view>
					<view class="btn btn-copy" @click="copy">复制</view>
				</view>
			</view>
			<view class="invitation-trip"></view>
		</view>
		<view class="prize">
			<view class="prize-header">
				<view>我的邀请奖励</view>
			</view>
			<view class="prize-main">
				<view class="prize-main-left">
					<view class="prize-main-left-top">已邀请好友</view>
					<view class="prize-main-left-bottom"><text class="red-bold">{{info.inviteCount}}</text>人</view>
				</view>
				<view class="prize-main-right">
					<view :class="index==0?'prize-main-right-top':'prize-main-right-bottom'" v-for="(item,index) in flObject" :key="index">
						<text>{{item.name}}：</text>
						<text class="red-bold">{{item.value}}</text>
						<text>{{item.unit}}</text>
					</view>
					<!-- <view class="prize-main-right-top">汽油：<text class="red-bold">45628</text>个</view>
					<view class="prize-main-right-bottom">分红：<text class="red-bold">100%</text></view> -->
				</view>
			</view>
		</view>
		<view class="pd15" style="margin-top: 48rpx;">
			<view class="inv_list">
				<view class="inv-header">
					已邀请好友列表
				</view>
				<view class="friends">
					<view class="friends-header">
						<view class="friends-header-item">用户</view>
						<view class="friends-header-item">时间</view>
						<view class="friends-header-item">验证</view>
					</view>
					<view class="friends-list">
						<block v-if="list&&list.length>0">
							<view class="friends-list-row" v-for="(item,index) in list" :key='index'>
								<view class="friends-list-item" style="justify-content: flex-start;padding-left: 20rpx;">
									<image :src="item.avatar ? $realSrc(item.avatar) : '/static/tx.png'"></image>
									<text class="user">{{item.receive_truename}}</text>
								</view>
								<view class="friends-list-item">
									{{item.create_time|parseTime("{y}-{m}-{d}")}}
								</view>
								<view class="friends-list-item">
									{{item.confirm_status==-1?'不确认':""}}{{item.confirm_status==0?'未确认':""}}{{item.confirm_status==1?'已确认':""}}
								</view>
							</view>
						</block>
						<view v-else class="empty">暂无数据</view>
					</view>
				</view>
			</view>
		</view>
		<popup ref="popup" type="center" :mask-click="true">
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
		components: {
			Popup
		},
		data() {
			return {
				page:1,
				pageSize:10,
				list: [],
				info: {},
				flObject:[],
				noMore:false,
			}
		},
		onLoad() {
			this.page = 1
			this.list = []
			this.noMore = false
			this.load()
		},
		onNavigationBarButtonTap(e) {
			this.open()
		},
		onReachBottom() {
			if(!this.noMore){
				this.page ++
				this.load()
			}
		},
		methods: {
			load() {
				this.$api.request('User/Confirm/invitationList', {
					page: this.page,
					pagesize: this.pageSize,
					type: 1,
				}).then(res => {
					this.info = res.data
					if(res.data.inviteList.length<this.pageSize){
						this.noMore = true
					}
					this.list = this.list.concat(res.data.inviteList)
					let flObject = res.data.flObject
					if(flObject){
						if(typeof flObject == "string"){
							this.flObject = JSON.parse(flObject)
						}else{
							this.flObject = flObject
						}
					}
				})
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			// 复制
			copy(){
				try{
					if(this.info.inviteCode){
						let text = this.info.inviteCode + ''
						uni.setClipboardData({
							data:text,
							success:()=> {
								uni.showToast({
									title:"复制成功",
									icon:"none"
								})
							}
						})
					}
				}catch(e){
					console.log(e);
				}
			},
			share(){
				let uid = this.$store.getters.userInfo.uid
				console.log(uid);
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					href: "https://lianche.haoshuninfo.com/h5/share/index.html#/pages/share/invitefriend?uid="+uid,
					title: "链车首批特邀用户，多重壕礼等你拿",
					summary: "完成注册，即可领取",
					imageUrl: "../../static/logo.png",
					success: function(res) {
						// console.log('success:' + JSON.stringify(res));
						// type 分享类型，0:其他，1：短视频   channel 分享渠道,0:其他，1:微信好友或群，2:微信朋友圈, 3:微博, 4:qq, 5:qq空间
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background-color: #eeeeee;
	}

	.bg {
		@include size(750rpx, 745rpx);
	}

	.banner-title {
		@include font(74rpx, #FFFFFF, Bold);
		margin-top: 106rpx;
		text-align: center;
	}

	.banner-trip {
		@include font(36rpx, #FFFFFF);
		margin-top: 106rpx;
		text-align: center;
	}

	.invitation {
		position: absolute;
		top: 398rpx;
		left: 30rpx;
		@include size(690rpx, 546rpx);

		.invitation-bg {
			border-radius: 16rpx;
			background-color: #FFFFFF;
			opacity: .5;
			@include size(690rpx, 458rpx);
			box-shadow: 0px 8px 17px 1px rgba(199, 199, 199, 0.68);
		}

		.invitation-main {
			position: absolute;
			top: -88rpx;
			left: 30rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;
			@include size(630rpx, 458rpx);
			@include fr(b, s);

			.invitation-main-left {
				padding-left: 35rpx;

				.invitation-main-left-title {
					margin-top: 65rpx;
					@include font(30rpx, #191C2F);
					line-height: 30rpx;
				}

				.invitation-main-left-code {
					margin-top: 20rpx;
					@include font(60rpx, #191C2F, Bold);
				}
			}

			.invitation-main-right {
				padding: 0 30rpx;

				.btn {
					@include size(164rpx, 64rpx);
					line-height: 64rpx;
					text-align: center;
					border-radius: 64rpx;
					font-size: 24rpx;
				}

				.btn-share {
					margin-top: 60rpx;
					color: #FFFFFF;
					background: linear-gradient(140deg, #FC7861, #F84C5A);
				}

				.btn-copy {
					margin-top: 36rpx;
					border: 2rpx solid #F8515B;
					color: #F9575C;
				}
			}
		}

		.invitation-trip {
			@include size(690rpx, 297rpx);
			background-image: url("../../static/images/juxing.png");
			background-size: cover;
			position: absolute;
			top: 162rpx;
			left: 0;
		}
	}

	.prize {
		@include size(690rpx, 357rpx);
		border-radius: 30rpx;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 160rpx;
		background-color: #FFFFFF;

		.prize-header {
			height: 98rpx;
			background-color: #FC7861;
			@include fr(b, c);
			padding: 0 43rpx;
		}

		.prize-main {
			@include fr(b, c);
			padding-top: 56rpx;

			.prize-main-left {
				@include size(300rpx, 120rpx);
				padding: 14rpx 0;
				// padding-left: 60rpx;
				border-right: 2rpx solid #DDDDDD;
				text-align: center;

				// @include fr(s,b);
				.prize-main-left-top {
					@include font(30rpx, #434343);
				}

				.prize-main-left-bottom {
					margin-top: 8rpx;
					@include font(30rpx, #434343);
				}
			}

			.prize-main-right {
				flex-grow: 1;
				padding-left: 66rpx;

				.prize-main-right-top {
					@include font(30rpx, #434343);
				}

				.prize-main-right-bottom {
					margin-top: 8rpx;
					@include font(30rpx, #434343);
				}
			}
		}
	}

	.red-bold {
		@include font(40rpx, #F8515B, Bold);
	}
	.red{
		color: #F8515B!important;
	}

	.inv_list {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		.inv-header{
			margin: 0 40rpx;
			padding: 40rpx 0;
			@include font(34rpx, #444444);
			border-bottom: 1rpx solid #EEEEEE;
		}
		.friends{
			padding-bottom: 60rpx;
			.friends-header{
				padding: 0 40rpx;
				@include size(100%,80rpx);
				@include fr(c,c);
				.friends-header-item{
					flex: 1;
					@include fr(c,c);
					@include font(26rpx, #B4B4BC);
				}
			}
			.friends-list{
				padding: 0 30rpx;
				.friends-list-row{
					@include size(100%,80rpx);
					@include fr(b,c);
					.friends-list-item{
						width: 33.33%;
						@include fr(c,c);
						@include font(26rpx, #3A3C56);
						image{
							@include size(50rpx);
							border-radius: 50rpx;
							margin-right: 20rpx;
							flex-shrink: 0;
						}
						.user{
							// width: 150rpx;
							overflow: hidden;
							@include ell();
						}
					}
				}
				.empty{
					@include fr(c,c);
					@include font(26rpx, #3A3C56);
					padding-top: 30rpx;
				}
			}
		}
	}
	
	.popup_tip{width: 80%;background-color: #FFFFFF;border-radius: 16rpx;position: fixed;left: 50%;top: 50%;
	transform: translate(-50%, -50%);margin: auto;}
	.gbbtn{position: absolute;right:0;top:-10%;font-size:39rpx;color:#B3B3BB}
</style>
