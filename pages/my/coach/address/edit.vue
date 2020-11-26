<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<view class="left">训练场名称</view>
				<view class="right"><input v-model="form.name" :disabled="readonly" placeholder="请填写训练场名称"/></view>
			</view>
			<view class="form-item">
				<view class="left">所在地区</view>
				<view class="right" @tap="navMap">
					<input disabled :value="`${form.pname}${form.cityname}${form.adname}`" placeholder="请选择地区"/>
					<view class="right-icon">
						<text class="iconfont icon-lc-21 icon-dw"></text>
						<text class="icon-dw-text">定位</text>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="left">详细地址</view>
				<view class="right"><input class="address" :disabled="readonly" v-model="form.address" placeholder="请填写详细地址"/></view>
			</view>
			<view class="form-item">
				<view class="left">设置默认地址</view>
				<view class="right"><view></view><switch color='#F6A704' :checked="form.isDefault==1" @change="switchChange"/></view>
			</view>
		</view>
		<view class="bottom">
			<view class="btn" @tap="submit">
				<text>保存</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default{
		data(){
			return{
				readonly:false,
				form:{
					trainAddressId:0,
					name:'',
					address:'',
					lng:0,
					lat:0,
					pname:'',
					cityname:'',
					adname:'',
					isDefault:0
				},
				selectAddress:{}
			}
		},
		computed:{
			...mapGetters(['mapSelectAddress','editAddress'])
		},
		onLoad(e) {
			var webView = this.$mp.page.$getAppWebview();  
			if(this.editAddress){
				this.form = this.editAddress
				console.log(this.editAddress)
				uni.setNavigationBarTitle({
					title:'编辑训练场'
				})
			}else{
				webView.setTitleNViewButtonStyle(0, {
				    text: '',
					width:'0px'
				});
				uni.setNavigationBarTitle({
					title:'添加训练场'
				})
			}
		},
		onShow() {
			if(!this.editAddress&&this.mapSelectAddress){
				this.selectAddress = this.mapSelectAddress
				this.form.trainAddressId = this.selectAddress.readonly ? this.selectAddress.id : 0
				this.form.name = this.selectAddress.name
				this.form.pname = this.selectAddress.pname
				this.form.cityname = this.selectAddress.cityname
				this.form.adname = this.selectAddress.adname
				this.form.address = this.selectAddress.address
				this.form.lng = this.selectAddress.lng || parseFloat(this.selectAddress.location.split(',')[0])
				this.form.lat = this.selectAddress.lat || parseFloat(this.selectAddress.location.split(',')[1])
				this.readonly =  this.selectAddress.readonly
			}
		},
		onNavigationBarButtonTap(e){
			console.log(e)
			this.delete()
		},
		methods:{
			navMap(){
				uni.navigateTo({
					url:'./map'
				})
			},
			switchChange(e){
				this.form.isDefault = e.detail.value ? 1 : 0 
			},
			submit(){
				console.log(this.form)
				let params = JSON.parse(JSON.stringify(this.form))
				this.$api.request('Train/TrainAdress/addTrainAdress',params).then(res=>{
					this.$api.Toast('保存成功')
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1500)
				})
			},
			delete(){
				this.$api.request('Train/TrainAdress/delMyTrainAddress',{trainAddressId:this.form.trainAddressId}).then(res=>{
					this.$api.Toast('删除成功')
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1500)
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		padding-bottom: 148rpx;
	}
	.form{
		border-top: 1rpx solid #2E3045;
		.form-item{
			height: 112rpx;
			padding: 42rpx 30rpx;
			border-bottom: 1rpx solid #2E3045;
			@include fr(s,c);
			.left{
				@include font(30rpx,#FFFFFF);
				width: 210rpx;
			}
			.right{
				flex-grow:1;
				@include fr(b,c);
				input{
					@include font(30rpx,#FFFFFF,Bold);
				}
				.right-icon{
					@include fr(e,c);
					.icon-dw{
						color: #6d8aff;
					}
					.icon-dw-text{
						width: 54rpx;
						@include font(26rpx,#FFFFFF);
					}
				}
				.address{
					flex-grow:1;
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
