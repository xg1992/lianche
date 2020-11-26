<template>
	<view>
		<view v-if="!hasSubmit" class="h_center f_grow" style="background-color: #24263A;height: 80rpx;border-radius: 16rpx;margin: 30rpx;padding: 30rpx;" >
			<view class="iconfont icon-lc-25 colorb3" style="margin-right: 20rpx;"></view>
			<input type="text" v-model="keyword" placeholder="请输入驾校名称" class="f_grow" confirm-type="search" @confirm='load'/>
		</view>
		<view class="list">
			<view class="item" v-for="item in list">
				<view class="left">
					<view class="cell mt0">
						<view class="main">
							<view class="title">名称：</view>
							<view class="content">{{item.name}}</view>
						</view>
					</view>
					<view class="cell">
						<view class="main">
							<view class="title">负责人：</view>
							<view class="content">{{item.user}}</view>
						</view>
					</view>
					<view class="cell" @click="phone(item.phone)">
						<view class="main">
							<view class="title">负责人手机号：</view>
							<view class="content">{{item.phone}}</view>
						</view>
					</view>
				</view>
				<view class="btn btn-1" v-if="item.confirm_status==-2" @click="apply(item)">去绑定</view>
				<view class="btn btn-2" v-else-if="item.confirm_status==1">已绑定</view>
				<view class="btn btn-3" v-else-if="item.confirm_status==0">待审核</view>
			</view>
		</view>
		<view class="btn_box" @click="share">
			<view class="btn-share">
				<text>邀请入驻</text>
			</view>
		</view>
		<!-- 为空提示页 -->
		<list-empty v-if="isEmpty && !list.length" :top="160" msg="当前用户不属于任何驾校" :img-width="500" img="/static/images/dl.png"></list-empty>
		<!-- 申请绑定时，填写教龄的弹窗 -->
		<lcDialog ref="dialog" title="申请成为驾校教练" titleSize="32rpx" :isCloseBtn="false" :hasForm="true" @confirm="confirm">
			<template v-slot:content >
				<view class="dialog-body">
					<view class="form-item">
						<input v-model="receive_truename" class="form-input" type="text" value="" placeholder="真实姓名" placeholder-style="color: #999" />
					</view>
					<picker class="picker-box" mode="date" fields="month" @change="dateChange">
						<view class="form-item">
							<text class="date-text" v-if="teaching_date">{{teaching_date}}</text>
							<text v-else>开始教学年月</text>
							<text class="iconfont icon-lc-59"></text>
						</view>
					</picker>
				</view>
			</template>
		</lcDialog>
		<share2 ref="share" :options="shareOptions"></share2>
	</view>
</template>

<script>
	import share2 from '@/components/share.nvue'
	import lcDialog from '@/components/lcDialog.vue'
	export default{
		components: {
			share2,
			lcDialog
		},
		data(){
			return{
				keyword:'',// 关键词
				page:1, // 页码
				pagesize:20,// 每页长度
				list:[],// 数据列表
				noMore:false, // 是否没有更多了
				hasSubmit:false, // 是否已提交过审核
				shareOptions: {
					params:{
						uid: '',
						invitation_type: 3
					}, // 分享的参数
					shareUrl: "pages/share/download",
					title: '链车-打造品牌形象、拓展业务渠道！',
					summary: '您的好友邀请您加入链车，帮助你打造品牌形象、拓展业务渠道！',
					// imageUrl: '',
				},
				teaching_date: '',
				receive_truename: '',
				isEmpty: false,
			}
		},
		onLoad() {
			this.shareOptions.params.uid = this.$api.storage('uid');
			this.getInfo()
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
			// 获取是否已提交过审核
			getInfo(){
				this.$api.request('My/School/schoolShow',{}).then(res=>{
					console.log(res);
					if(res.res==1&&res.data.name){
						this.hasSubmit = true
						this.list = [res.data];
						this.isEmpty = false;
					}else{
						this.hasSubmit = false;
						this.isEmpty = true;
					}
				})
			},
			// 获取列表数据
			getList(){
				let params = {
					key:this.keyword,
					page:this.page,
					pagesize:this.pagesize
				}
				this.$api.request('Search/Search/school',params).then(res=>{
					console.log(res);
					if(res.data.list.length>0){
						this.list = this.list.concat(res.data.list);
						this.isEmpty = false; // 移除无数据提示
					}else{
						uni.showToast({
							title:'暂无数据',
							icon:'none'
						})
					}
					if(res.data.list.length<this.pagesize){
						this.noMore = true
					}
				})
			},
			// 申请绑定
			apply(item){
				this.schoolInfo = item;
				this.$refs.dialog.open();
			},
			confirm(){
				if(!this.receive_truename){
					uni.showToast({
						title: '请填写真实姓名',
						icon: 'none'
					})
					return ;
				}
				if(!this.teaching_date){
					uni.showToast({
						title: '请填写开始教学年份',
						icon: 'none'
					})
					return ;
				}
				this.$refs.dialog.hide(); // 关闭弹窗
				let {uid} = this.schoolInfo;
				let params = {to_uid:uid,teaching_date:this.teaching_date,receive_truename:this.receive_truename };
				this.$api.request('User/Confirm/applyBindingSchool',params).then(res=>{
					uni.showToast({
						title:'已申请绑定，等待驾校确认',
						icon:'none'
					})
					setTimeout(()=>{
						this.getInfo()
					},1500)
				})
			},
			// 打电话
			phone(phoneNumber){
				uni.makePhoneCall({
					phoneNumber:phoneNumber
				})
			},
			share(){
				this.$refs.share.openShare()
			},
			dateChange(e){
				this.teaching_date = e.detail.value;
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			@include fr(b,c);
			.cell{
				margin-top: 30rpx;
				@include fr(b,s);
				.main{
					// width: 580rpx;
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
			.btn{
				@include size(144rpx,64rpx);
				@include fr(c,c);
				border-radius: 8rpx;
				flex-shrink: 0;
			}
			.btn-1{
				background-color: #F6A704;
				@include font(26rpx,#FFFFFF);
			}
			.btn-2{
				border: 2rpx solid #3A3C55;
				@include font(26rpx,#B3B3BB);
			}
			.btn-3{
				border: 2rpx solid #3A3C55;
				@include font(26rpx,#FF6562);
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
	.btn_box {
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 30rpx;
		width: 100%;
		background-color: #191C2F;
		box-sizing: border-box;
	}
	.btn-share {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #2E3045;
		border-radius: 16rpx;
		text-align: center;
	}
	.dialog-body {
		padding: 60rpx;
		padding-top: 0;
	}
	.form-item {
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		border-radius: 8rpx;
		font-size: 32rpx;
		color: #999;
		border: 1px solid #ccc;
		margin-top: 30rpx;
		
		.date-text {
			color: #333;
		}
		
		.form-input {
			color: #333;
			font-size: inherit;
		}
	}
</style>
