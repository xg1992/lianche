<template>
	<view class="main">
		<view class="item" :class="type==1?'close':'open'">
			<view class="content">
				<view class="icon icon1"></view>
				<view class="text">
					<view class="text-title">预约模式</view>
					<view class="text-desc">学员可自主预约练车</view>
				</view>
			</view>
			<view class="button">
				<block v-if="type!=1">
					<view class="btn btn-open" @click="goOpen(0)">开启</view>
				</block>
				<block v-if="type==1">
					<view class="btn btn-edit" @click="goConfig(1)">配置</view>
					<view class="btn btn-close" @click="close(1)">关闭</view>
				</block>
			</view>
		</view>
		<view class="item" :class="type==2?'close':'open'">
			<view class="content">
				<view class="icon icon2"></view>
				<view class="text">
					<view class="text-title">分配模式</view>
					<view class="text-desc">由驾校统一排班练车</view>
				</view>
			</view>
			<view class="button">
				<block v-if="type!=2">
					<view class="btn btn-open" @click="goOpen(2)">开启</view>
				</block>
				<block v-if="type==2">
					<view class="btn btn-edit" @click="goConfig(2)">配置</view>
					<view class="btn btn-close" @click="close(2)">关闭</view>
				</block>
			</view>
		</view>
		<view class="trip">
			<view class="trip-title">温馨提示：</view>
			<view class="trip-content">排班模式影响到各教练学员练车安排，一旦设定，请勿随意更改！</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				type:0
			}
		},
		onShow() {
			this.load()
		},
		onNavigationBarButtonTap() {
			this.save()
		},
		methods:{
			load(){
				this.$api.request('User/User/configByQiyeShow',{}).then(res=>{
					this.type = res.data.train_type
				})
			},
			goOpen(type){
				if(type==2&&!this.$api.qx([32])){
					return this.$api.Toast('暂不支持教练启用')
				}else if(type==0&&!this.$api.qx([16])){
					return this.$api.Toast('暂不支持分部启用')
				}
				if(type==0){
					let params = {
						train_type:type,
						schedule_config:'',
						train_car_type:'',
						subject:'',
						apply_batch_config:''
					}
					this.$api.request('User/User/configByQiye',params).then(res=>{
						uni.showToast({
							title:'开启成功',
							icon:'none',
							mask:true
						})
						this.load()
					})
				}else{
					uni.navigateTo({
						url:`./set_detail?type=${type}&isEdit=1`
					})
				}
			},
			goConfig(type){
				uni.navigateTo({
					url:`./set_detail?type=${type}&isEdit=1`
				})
			},
			close(type){
				this.$api.request('User/User/closeConfigByQiye',{train_type:type}).then(res=>{
					this.load()
				})
			}
		}
	}
</script>

<style lang="scss">
	.main{
		padding-top: 56rpx;
		.item{
			border-radius: 16rpx;
			@include fr(b,c);
			padding-left: 24rpx;
			padding-right: 30rpx;
			height: 152rpx;
			margin: 30rpx;
			.content{
				@include fr(s,c);
				.icon{
					@include size(72rpx);
					background-size: cover;
				}
				.icon1{
					background-image: url(../../../static/icons/one.png);
				}
				.icon2{
					background-image: url(../../../static/icons/more.png);
				}
				.text{
					margin-left: 12rpx;
				}
			}
			.button{
				@include fr(e,c);
				.btn{
					@include size(120rpx,64rpx);
					border-radius: 8rpx;
					@include font(30rpx,#FFFFFF);
					@include fr(c,c);
					margin-left: 30rpx;
				}
				.btn-edit{
					border: 1rpx solid #3A3C55;
				}
				.btn-close{
					background-color: #3A3C55;
				}
				.btn-open{
					background-color: #F6A704;
				}
			}
		}
		.open{
			background-color: #FFFFFF;
			.content{
				.text{
					.text-title{
						@include font(34rpx,#191C2F,bold);
					}
					.text-desc{
						@include font(24rpx,#191C2F);
					}
				}
			}
		}
		.close{
			background-color: #2E3045;
			.content{
				.text{
					.text-title{
						@include font(34rpx,#FFFFFF,bold);
					}
					.text-desc{
						@include font(24rpx,#FFFFFF);
					}
				}
			}
		}
		
		.trip{
			margin-top: 72rpx;
			padding: 40rpx;
			padding-top: 0;
			&-title{
				@include font(30rpx,#E5E5E5);
			}
			&-content{
				margin-top: 30rpx;
				line-height: 34rpx;
				@include font(26rpx,#E5E5E5);
			}
		}
	}
</style>
