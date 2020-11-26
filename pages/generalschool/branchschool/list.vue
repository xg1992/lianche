<template>
	<view>
		<tab :list="navList" @tab="onChange" :active="tabCurrentIndex"></tab>
		<view class="line"></view>
		<view class="list" v-if="list.length>0">
			<view class="item" v-for="item in list">
				<view class="cell mt0">
					<view class="main">
						<view class="title">名称：</view>
						<view class="content">{{item.school_name}}</view>
					</view>
				</view>
				<view class="cell">
					<view class="main">
						<view class="title">负责人：</view>
						<view class="content">{{item.receive_truename}}</view>
					</view>
				</view>
				<view class="cell" @click="phone(item.receive_mobile)">
					<view class="main">
						<view class="title">负责人手机号：</view>
						<view class="content">{{item.receive_mobile}}</view>
					</view>
					<view class="iconfont icon-lc-46"></view>
				</view>
				<view class="cell">
					<view class="main">
						<view class="title">地址：</view>
						<view class="content">{{item.address}}163号</view>
					</view>
					<view class="iconfont icon-lc-21"></view>
				</view>
				<view class="item-bottom">
					<block v-if="tabCurrentIndex==0">
						<view class="btn btn-y" @click="del(item)">删除分部</view>
					</block>
					<block v-if="tabCurrentIndex==1">
						<view class="btn btn-n" @click="confirm(item,-1)">非分部</view>
						<view class="btn btn-y" @click="confirm(item,1)">是分部</view>
					</block>
				</view>
			</view>
		</view>
		<list-empty v-else></list-empty>
		<view class="bottom" @click="shareshow = true">
			<view class="invitation">添加分部发送邀请</view>
		</view>
		<view :hidden="!shareshow" style="width:750rpx;border-top-right-radius: 16rpx;border-top-left-radius: 16rpx;position: absolute; bottom:0;z-index:99;background-color:#fff;">
				<view  class="grace-btdialog-btns" style="text-align:center;width: 750rpx; height: 90rpx; line-height: 90rpx;">
					<text class="grace-btdialog-btn "  style="text-align: center;width: 750rpx; color: #000000;font-weight:bold;">分享到</text>
				</view>
				<view class="scroll-view_H">
					<view  class="scroll-view-item_H uni-bg-red" v-for="(item, index) in fenxiang" :key="index" @click="actshare(index)">
						<image class="view-item_H_image" :src="item.src"></image>
						<text class="view-item_H_text">{{ item.name }}</text>
					</view>
				</view>
				
				<view class="s-line"></view>
				<view class="grace-btdialog-btns link-top" style="text-align:center;width: 750rpx;height: 90rpx; line-height: 90rpx;">
					<text class="grace-btdialog-btn" style=" text-align: center;width: 750rpx; color:#666666" @click="closeDialog">取消</text>
				</view>
				
			</view>
	</view>
</template>

<script>
	import tab from "@/components/tab.vue"
	export default{
		components:{
			tab
		},
		data(){
			return{
				tabCurrentIndex:0,
				navList:['分部','待确认分部'],
				list:[],
				page:1,
				pagesize:20,
				noMore:false,
				shareshow: false,
				fenxiang: [
					{ src: '/static/fenxiang1.png', name: '微信' },
					{ src: '/static/fenxiang2.png', name: '朋友圈' },
					/*{ src: '/static/fenxiang5.png', name: '微博' },
					{ src: '/static/fenxiang3.png', name: 'QQ' },
					{ src: '/static/fenxiang4.png', name: 'QQ空间' }*/
				]
			}
		},
		onLoad() {
			this.load()
		},
		onReachBottom() {
			this.more()
		},
		methods:{
			// 刷新数据
			load(){
				this.page = 1
				this.list = []
				this.getList()
			},
			// 加载更多
			more(){
				if(!this.noMore){
					this.page++
					this.getList()
				}
			},
			// 获取列表数据
			getList(){
				let confirm_status = (this.tabCurrentIndex == 0) ? 1 : 0
				let params = {
					invitationType:5,
					page:this.page,
					pagesize:this.pagesize,
					confirm_status:confirm_status
				}
				this.$api.request('User/Confirm/confirmUser',params).then(res=>{
					console.log(res);
					if(res.data.length>0){
						this.list = this.list.concat(res.data)
					}else{
						uni.showToast({
							title:'暂无数据',
							icon:'none'
						})
					}
					if(res.data.length<this.pagesize){
						this.noMore = true
					}
				})
			},
			// tab点击
			onChange(detail){
				this.tabCurrentIndex = detail.index
				this.load()
			},
			// 删除分部
			del(item){
				this.$confirm({
					content: '确定删除分部吗？',
					confirm:()=>{
						let params = {id:item.id}
						console.log(params);
						this.$api.request('User/Confirm/confirmFbCancel',params).then(res=>{
							uni.showToast({
								title:'删除成功',
								icon:'none'
							})
							setTimeout(()=>{
								this.load()
							},1500)
						})
					},
					cancel(){
						console.log('取消')
					},
				})
			},
			// 确认分部
			confirm(item,status){
				console.log(item);
				let content = (status == 1) ? '确认绑定该分部吗' : '确认拒绝绑定该分部吗'
				let title = (status == 1) ? '已确认绑定分部' : '已拒绝绑定分部'
				this.$confirm({
					content: content,
					confirm:()=>{
						let params = {to_uid:item.uid,id:item.id,confirmType:status}
						console.log(params);
						this.$api.request('User/Confirm/confirmFb',params).then(res=>{
							uni.showToast({
								title:title,
								icon:'none'
							})
							setTimeout(()=>{
								this.load()
							},1500)
						})
					},
					cancel(){
						console.log('取消')
					},
				})
			},
			// 打电话
			phone(phoneNumber){
				uni.makePhoneCall({
					phoneNumber:phoneNumber
				})
			},
			actshare(idx) {
				let all = { provider: '', scene: '' };
				if (idx == 0) {
					all.provider = 'weixin';
					all.scene = 'WXSceneSession';
				}
				if (idx == 1) {
					all.provider = 'weixin';
					all.scene = 'WXSenceTimeline';
				}
				if (idx == 2) {
					all.provider = 'sinaweibo';
					all.scene = '';
				}
				if (idx == 3) {
					all.provider = 'qq';
					all.scene = '';
				}
				if (idx == 4) {
					all.provider = 'qq';
					all.scene = '';
				}
				// console.log(all);
				let that = this;
				let uid = this.$api.storage('uid');
				// console.log(uid);
				uni.share({
					provider: all.provider,
					scene: all.scene,
					href: 'https://lianche.haoshuninfo.com/h5/share/index.html#/pages/share/invitation?uid=' + uid + '&invitation_type=5',
					title: that.$api.storage("userinfo").nickname + '邀请您加入链车',
					summary: '链车短视频以汽车驾驶教练学员、汽车自媒体KOL为短视频作品生产端，学车意向者、汽车爱好者为作品消费端',
					imageUrl: '/static/logo.png',
					success: function(res) {
						// console.log('success:' + JSON.stringify(res));
						// type 分享类型，0:其他，1：短视频   channel 分享渠道,0:其他，1:微信好友或群，2:微信朋友圈, 3:微博, 4:qq, 5:qq空间
						/*request('Video/Video/sharesAdd', {type:1,channel:idx+1,videoid:that.dataList[that.k].video_id,url:'http://uniapp.dcloud.io/',message:that.dataList[that.k].title}).then(res => {
				
							})*/
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			closeDialog() {
				this.shareshow = false;
			},
		}
	}
</script>

<style lang="scss">
	.line{
		@include size(750rpx,20rpx);
		background-color: #2E3045;
	}
	.list{
		padding-bottom: 174rpx;
		.item{
			background-color: #2E3045;
			border-radius: 16rpx;
			margin: 30rpx;
			padding: 40rpx 30rpx;
			.cell{
				margin-top: 30rpx;
				@include fr(b,s);
				.main{
					width: 580rpx;
					line-height: 40rpx;
					@include fr(s,s);
					.title{
						flex-shrink: 0;
						@include font(30rpx,#B3B3BB);
					}
					.content{
						@include font(30rpx,#FFFFFF);
					}
				}
			}
			.item-bottom{
				margin-top: 30rpx;
				padding: 28rpx 0;
				padding-bottom: 0;
				border-top: 1rpx solid #191C2F;
				@include fr(e,c);
				.btn{
					margin-left: 54rpx;
					border-radius: 8rpx;
					@include fr(c,c);
					@include size(160rpx,64rpx);
				}
				.btn-n{
					border: 2rpx solid #3A3C55;
					@include font(26rpx,#B3B3BB);
				}
				.btn-y{
					border: 2rpx solid #3A3C55;
					background-color: #3A3C55;
					@include font(26rpx,#FFFFFF);
				}
			}
		}
	}
	.bottom{
		background-color: #191C2F;
		position: fixed;
		bottom: 0;
		left: 0;
		@include size(750rpx,144rpx);
		@include fr(c,c);
	}
	.invitation{
		position: relative;
		background-color: #2E3045;
		border-radius: 16rpx;
		@include size(690rpx,88rpx);
		@include fr(c,c);
		@include font(34rpx,#FFFFFF);
	}
	.invitation::after{
		content: "+1000奖励金";
		position: absolute;
		@include font(22rpx,#FFFFFF);
		top: 28rpx;
		margin-left: 28rpx;
	}
	.mt0{
		margin-top: 0!important;
	}
	
	.scroll-view_H {
		display: flex;
		flex-direction: row;
		// justify-content: center;
		width: 750rpx;
	}
	.scroll-view-item_H {
		// width: 52px;
		height: 52px;
		padding: 5px 10px;
		text-align: center;
		// padding-left: 160rpx;
	}
	.view-item_H_image {
		width: 50px;
		height: 50px;
		border-radius: 25px;
	}
	.view-item_H_text {
		display: block;
		font-size: 12px;
		text-align: center;
		margin-top: 20rpx;
		color: #000000;
		width: 52px;
	}
	.share-box {
		width: 750rpx;
		height: 268rpx;
		position: absolute;
		bottom: 0;
		z-index: 99;
		background-color: #fff;
	}
	
	.s-line{
	width:750rpx;
	height:2rpx;
	background-color: #CFD6D7;
	margin-top: 80rpx;
	
	}
</style>
