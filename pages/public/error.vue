<template>
	<view class="error">
	    <view class="block" v-if="code==-1">
			<image class="image network" src="/static/images/wl.png" mode="widthFix"></image>
			<text class="empty-text">网络出问题了，快去检查一下吧</text>
		</view>
		<view class="block" v-if="code==13">
			<image class="image login" src="/static/images/dl.png" mode="widthFix"></image>
			<text class="empty-text">您当前尚未登录，请前往登录</text>
			<view class="btn" @tap="goLogin">登录</view>
		</view>
		<view class="block" v-if="code==0">
			<image class="image busy" src="/static/images/fwq.png" mode="widthFix"></image>
			<text class="empty-text">服务器繁忙~~</text>
			<view class="btn" @tap="goBack">返回</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				code:-1,
				listen:false,
				isGoback:false
			}
		},
		onLoad(e) {
			console.log(e)
			this.code = parseInt(e.code)
			let title = ''
			switch(this.code){
				case 0:
				title = '服务器繁忙'
				break
				case 13:
				title = '未登录'
				if(this.$store.getters.userInfo){
					this.$store.commit('logout')
				}
				break
				case -1:
				title = '网络未连接'
				!this.listen && this.handelNetwork()
				break
			}
			uni.setNavigationBarTitle({title:title});
		},
		methods:{
			handelNetwork(){
				this.listen = true
				const networkChange = uni.onNetworkStatusChange(res=> {
					console.log(res)
				    if(res.isConnected){
						!this.isGoback && this.goBack()
					}
				});
			},
			goLogin(){
				uni.redirectTo({
					url:'/pages/login/login'
				})
			},
			goBack(){
				this.isGoback = true
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	.error{
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 750rpx;
		height: 100vh;
	}
	.block{
		margin-top: -200rpx;
	}
	.image{
		display: block;
		margin: 0 auto;
	}
	.network{
		width: 320rpx;
	}
	.busy{
		width: 400rpx;
	}
	.login{
		width: 540rpx;
	}
	.empty-text{
		font-size: 30rpx;
		margin-top: 122rpx;
		color: #FFFFFF;
		display: block;
	}
	.btn{
		width: 200rpx;
		text-align: center;
		margin: 0 auto;
		padding: 20rpx 0;
		border-radius: 72rpx;
		color: #FFFFFF;
		font-size: 34rpx;
		background-color: #F6A704;
		margin-top: 50rpx;
	}
</style>

