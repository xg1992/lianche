<template>
	<view class="container">
		<view class="list">
			<view class="list-item" v-for="(item,index) in list" :key="index" v-if="list.length>0" @tap="itemTap(item)">
				<view class="item-left" :class="item.isDefault==1?'bg-y':'bg-b'">
					<image :src="item.isDefault==1?'/static/icons/w-addr.png':'/static/icons/b-addr.png'"></image>
				</view>
				<view class="item-right">
					<view class="title">{{item.name}}<text class="default" v-if="item.isDefault==1">默认</text></view>
					<view class="address">
						<view class="address-text">{{item.address}}</view>
						<view class="address-edit" @tap="navEdit(item)">编辑</view>
					</view>
				</view>
			</view>
			<list-empty v-if="list.length==0" :msg="msg"></list-empty>
		</view>
		<view class="bottom">
			<view class="btn" @tap="navEdit(null)">
				<text></text>
				<text>添加新地址</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				isSelect:false,
				list:[],
				msg:''
			}
		},
		onLoad(e) {
			this.isSelect = e.isSelect || false
			// this.load()
		},
		onShow() {
			this.load()
		},
		onPullDownRefresh() {
			this.load()
		},
		methods:{
			load(){
				this.$api.request('Train/TrainAdress/getMyTrainAdresses',{}).then(res=>{
					this.list = res.data
					this.msg = res.msg
					uni.stopPullDownRefresh();
				}).catch(err=>{
					uni.stopPullDownRefresh();
				})
			},
			navEdit(item){
				this.$store.commit('setEditAddress',item)
				this.$store.commit('setMapSelectAddress',null)
				uni.navigateTo({
					url:'/pages/my/coach/address/edit'
				})
			},
			itemTap(item){
				if(this.isSelect){
					this.$store.commit('setSelectAddress',item)
					uni.navigateBack({
						delta:1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container{
		padding-bottom: 148rpx;
	}
	
	.list{
		.list-item{
			@include fr(s,c);
			padding: 40rpx 36rpx;
			.item-left{
				@include fr(c,c);
				flex-shrink:0;
				@include size(68rpx);
				border-radius: 50%;
				image{
					@include size(32rpx,35rpx);
				}
			}
			.bg-y{
				background-color: #F6A704;
			}
			.bg-b{
				background-color: #3A3C55;
			}
			.item-right{
				flex-grow:1;
				margin-left: 36rpx;
				.title{
					@include font(34rpx,#FFFFFF,bold);
					.default{
						@include font(24rpx,#F6A704,200);
						background-color: #3A3C55;
						border-radius: 4rpx;
						margin-left: 17rpx;
						@include size(72rpx,36rpx);
						line-height: 36rpx;
						text-align: center;
						padding: 0 12rpx;
					}
				}
				.address{
					margin-top: 15rpx;
					@include fr(b,c);
					.address-text{
						width: 490rpx;
						@include font(26rpx,#FFFFFF);
						@include ell();
					}
					.address-edit{
						@include font(26rpx,#494C6A);
						padding-left: 27rpx;
						border-left: 1rpx solid #2E3045;
					}
				}
			}
		}
	}
	
	
	.bottom{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 30rpx;
		border-top: 1rpx solid #2E3045;
		background-color: #191C2F;
		.btn{
			border-radius: 16rpx;
			background-color: #F6A704;
			@include font(34rpx,#FFFFFF);
			@include fr(c,c);
			height: 88rpx;
			line-height: 88rpx;
		}
	}
	
</style>
