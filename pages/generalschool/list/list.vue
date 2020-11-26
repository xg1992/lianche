<template>
	<view>
		<view v-if="hasSubmit==false" class="h_center f_grow" style="background-color: #24263A;height: 80rpx;border-radius: 16rpx;margin: 30rpx;padding: 30rpx;" >
			<view class="iconfont icon-lc-25 colorb3"></view>
			<input type="text" v-model="keyword" placeholder="请输入总部名称" class="f_grow" confirm-type="search" @confirm='load'/>
		</view>
		<view class="list">
			<view class="item" v-for="item in list" @click="goPage(item)">
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
				<view class="btn btn-2" v-if="item.confirm_status==1">已绑定</view>
				<view class="btn btn-3" v-if="item.confirm_status==0">待审核</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				keyword:'',// 关键词
				page:1, // 页码
				pagesize:20,// 每页长度
				list:[],// 数据列表
				noMore:false, // 是否没有更多了
				hasSubmit:null, // 是否已提交过审核
			}
		},
		onLoad() {
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
				this.$api.request('My/School/schoolShowTop',{}).then(res=>{
					console.log(res);
					if(res.res==1&&res.data.confirm_status!=-1){
						this.hasSubmit = true
						this.list = [res.data]
					}else{
						this.hasSubmit = false
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
						this.list = this.list.concat(res.data.list)
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
				this.$confirm({
					content: '确认绑定该总部吗',
					confirm:()=>{
						let params = {to_uid:item.uid}
						this.$api.request('User/Confirm/applyBindingFb',params).then(res=>{
							uni.showToast({
								title:'已申请绑定，等待总部确认',
								icon:'none'
							})
							setTimeout(()=>{
								this.getInfo()
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
			goPage(item){
				uni.navigateTo({
					url: '/pages/homepage/homepage?uid=' + item.uid
				});
			}
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
</style>
