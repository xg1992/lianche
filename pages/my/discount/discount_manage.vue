<template>
	<view class="pd30">
		<view class="arch-bg" v-for="(item,index) in list">
			<view class="view-item-content">
				<view class="headimg" :style="{backgroundImage: 'url('+item.img+')'}">
				</view>
				<view class="info">
					<view class="name">{{item.title}}</view>
					<view>{{item.text}}</view>
				</view>
				<text class="edit-btn" @click="toDetail(item.url)">{{item.btnText||'查看'}}</text>
			</view>
		</view>
		
		<view class="remark">
			<view class="font36">常见说明：</view>
			<view>1、只有商家才能发券吗？</view>
			<view>目前只有认证商家才能发券，这是为商家引流、提升业绩提供的渠道。</view>
			<br />
			<view>2、如何代发优惠券？</view>
			<view>从发券商家中获得专属标识码 - 选择代发优惠券 - 新增 - 填写标识 - 完成。</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				list: [
					{title: '已领优惠券',text: '已领商家发放的优惠券',btnText: '查看',url:'index',img:'/static/discount/yiling.png'},
					{title: '代发优惠券',text: '代发合作伙伴的优惠券',btnText: '查看',url:'issue_coupons?usertype=2',img:'/static/discount/fafang.png'},
				]
			}
		},
		onLoad() {
			// 根据权限添加对应功能
			let qx = this.$api.qx([32,64,512,1024]);
			if(qx){
				this.list.splice(1,0,{title: '发放优惠券',text: '发放自营的优惠券',btnText: '查看',url:'issue_coupons?usertype=1',img:'/static/discount/fafang.png'});
				this.list.push({title: '核销优惠券',text: '核销自营的优惠券',btnText: '核销',url:'verification/index',img:'/static/discount/hexiao.png'})
			}
		},
		methods: {
			toDetail(url){
				uni.navigateTo({
					url,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.pd30 {
	padding: 30rpx;
}
.arch-bg {
	margin-bottom: 30rpx;
	box-xizing: border-box;
	padding: 40rpx;
	width: 100%;
	height: 200rpx;
	background: #eee;
	background: radial-gradient(circle at 0 50%, transparent 20rpx, #eee 21rpx) top left,
							radial-gradient(circle at 100% 50%, transparent 20rpx, #eee 21rpx) top right;
	background-size: 60% 100%;
	background-repeat: no-repeat;
	border-radius: 16rpx;
}
.view-item-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	& view {
		color: #191C2F;
	}
	
	.headimg {
		min-width: 94rpx;
		width: 94rpx;
		height: 94rpx;
		line-height: 94rpx;
		border-radius: 50%;
		text-align: center;
		background-size: contain;
		.iconfont {
			font-size: 60rpx;
			color: #fff;
		}
	}
	.info {
		padding-left: 30rpx;
		flex: 1;
	}
	.name {
		font-size: 36rpx;
		margin-bottom: 10rpx;
	}
	.edit-btn {
		display: inline-block;
		min-width: 112rpx;
		width: 112rpx;
		height: 64rpx;
		line-height: 64rpx;
		border: 1px solid #3A3C55;
		border-radius: 8rpx;
		font-size: 28rpx;
		text-align: center;
		color: #191C2F;
	}
}
.remark {
	margin-top: 50rpx;
	line-height: 48rpx;
	view {
		color: #B3B3BB;
	}
	
}
</style>
