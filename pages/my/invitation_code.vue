<template>
	<view class="container" :style="{height:height+'px'}">
		<view v-if="!isBinded">
			<input class="input-code" v-model="code" placeholder="请输入邀请码" placeholder-class="placeholder"/>
			<view class="btn" @tap="submit" v-if="!isBinded">绑定邀请码</view>
		</view>
		<view class="inviter-info" v-else>
			<view class="row-item">
				<text class="inviter-info-title">用户：</text>
				<input class="input" v-model="inviterInfo.nickname" disabled placeholder="请输入邀请码" placeholder-class="placeholder"/>
			</view>
			<view class="row-item">
				<text class="inviter-info-title">邀请码：</text>
				<input class="input" v-model="inviterInfo.uid" disabled placeholder="请输入邀请码" placeholder-class="placeholder"/>
			</view>
			<view class="row-item">
				<text class="inviter-info-title">绑定时间：</text>
				<input class="input" v-model="inviterInfo.create_time" disabled placeholder="请输入邀请码" placeholder-class="placeholder"/>
			</view>
			<view class="row-item">
				<text class="inviter-info-title"></text>
				<view class="btn binded" >已绑定邀请码</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				code:"",
				isBinded: false,
				height:uni.getSystemInfoSync().windowHeight,
				inviterInfo: {}
			}
		},
		onLoad(){
			this.getBindState()
		},
		methods:{
			getBindState(){
				this.$api.request("User/User/loadBindInvite",{}).then(res=>{
					if(res.res === 1 && res.data && res.data.uid){
						this.isBinded = true; // 已绑定邀请码
						this.inviterInfo = res.data;
					}
				})
			},
			submit(){
				if(!this.code){
					uni.showToast({
						title: '请输入邀请码',
						icon: 'none'
					})
					return ;
				}
				this.$confirm({
					content: '邀请码绑定后不能修改，请谨慎操作！',
					confirmBtnText: '继续绑定',
					confirm:()=>{
						this.$api.request("User/User/bindInvite",{inviteCode:this.code}).then(res=>{
							if(res.res === 1){
								uni.showToast({
									title: "邀请码绑定成功！",
									icon: 'none'
								})
								// 更新页面
								this.getBindState();
							}else{
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		@include fr(c,c);
	}
	.trip{
		
	}
	.input,.input-code{
		height: 80rpx;
		line-height: 40rpx;
		padding: 20rpx;
		background-color: #2E3045;
		border-radius: 10rpx;
		// border: 1rpx solid #EEEEEE;
		@include font(30rpx,#fff);
	}
	.input-code {
		margin-bottom: 100rpx;
	}
	.placeholder{
		@include font(30rpx,#bdbdbd);
	}
	.btn{
		padding: 20rpx 50rpx;
		background-color: #F6A704;
		border-radius: 70rpx;
		color: #FFFFFF;
		font-size: 34rpx;
		text-align: center;
		margin-top: 30rpx;
	}
	.binded {
		width: 100%;
		background-color: rgba(180,180,180,.6);
		color: #333;
	}
	.inviter-info {
		margin-top: -160rpx;
	}
	.row-item {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx;
	}
	.inviter-info-title {
		width: 160rpx;
		flex: 0 0 160rpx;
		text-align: right;
		white-space: nowrap;
	}
</style>
