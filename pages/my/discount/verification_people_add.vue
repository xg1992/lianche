<template>
	<view class="">
		<view class="search-view">
			<text class="grace-icons icon-search"></text>
			<input v-model="searchText" class="search-input" type="number" placeholder="请输入工作人员手机号码" @confirm="search" />
		</view>
		<view class="list">
			<view class="view-item-content">
				<image class="headimg" src="../../../components/coupon/static/coupon-bg-2.png" mode=""></image>
				<view class="info">
					<view class="name">东风不摆</view>
					<view class="phone">手机：13428288427</view>
				</view>
				<view class="btn-view">
					<view class="btn" @click="open">添加</view>
				</view>
			</view>
		</view>
		<lcDialog ref="dialog" :isCloseBtn="false" :hasForm="true" @confirm="confirm">
			<template v-slot:content >
				<view class="dialog-body">
					<view class="title">请选择工作人员权限<text class="small">(可多选)</text></view>
					<view class="checkbox-view">
						<view class="">
							<view class="checkbox-item" :class="{active: checkedList.indexOf(1) > -1}" @click="selected(1)">
								<text class="icon-bg"><text class="iconfont icon-lc-34"></text></text><text>发放优惠券</text>
							</view>
							<view class="checkbox-item" :class="{active: checkedList.indexOf(2) > -1}" @click="selected(2)">
								<text class="icon-bg"><text class="iconfont icon-lc-34"></text></text><text>核销优惠券</text>
							</view>
						</view>
					</view>
				</view>
			</template>
		</lcDialog>
	</view>
</template>

<script>
	import lcDialog from '@/components/lcDialog.vue'
	export default {
		components: {
			lcDialog
		},
		data(){
			return {
				searchText: '',
				checkedList: [], // 选择的权限
			}
		},
		methods:{
			open(){
				this.$refs.dialog.open()
			},
			confirm(){
				if(!this.checkedList.length){
					uni.showToast({
						title: '添加失败，至少选择一项',
						icon: 'none'
					})
					return ;
				}
				this.$refs.dialog.hide();
				// 提交
				this.$api.request('url',{list:this.checkedList}).then(res=>{
					console.log(res)
				})
				console.log('确定继续！',this.checkedList)
			},
			//验证是否手机号码
			isPhoneNo(value) {
				var rex = /^1[3-9]+\d{9}$/;
				if (rex.test(value)) {
					return true;
				} else {
					return false;
				}
			},
			search(){
				console.log(this.searchText)
				if(!this.isPhoneNo(this.searchText)){
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return false;
				}
				this.$api.request('url',{phone:this.searchText}).then(res=>{
					console.log(res)
				})
			},
			selected(item){
				let index = this.checkedList.indexOf(item)
				if(this.checkedList.indexOf(item) >= 0){
					this.checkedList.splice(index,1)
				}else{
					this.checkedList.push(item)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.search-view {
	position: relative;
	display: flex;
	align-items: center;
	margin: 30rpx;
	height: 80rpx;
	border-radius: 8rpx;
	background-color: #2E3045;
	
	.search-input {
		flex: 1;
	}
	.icon-search {
		display: inline-block;
		width: 100rpx;
		text-align: center;
	}
}
.view-item-content {
	width: 100%;
	display: flex;
	align-items: center;
	padding: 30rpx 60rpx;
	.headimg {
		width: 94rpx;
		height: 94rpx;
		border-radius: 50%;
	}
	.info {
		padding-left: 30rpx;
	}
	.name {
		font-size: 36rpx;
	}
	.btn-view {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		.btn {
			background-color: #F6A704;
			color: #fff;
			width: 144rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			border-radius: 8rpx;
		}
	}
}
.dialog-body {
	padding: 30rpx;
	& view {
		color: #191C2F;
	}
	.title {
		text-align: center;
		font-size: 40rpx;
		.small {
			font-size: 32rpx;
			color: #B3B3BB;
		}
	}
	.checkbox-view {
		margin-top: 30rpx;
		display: flex;
		justify-content: center;
		.checkbox-item {
			padding: 0 30rpx;
			height: 120rpx;
			line-height: 120rpx;
			font-size: 36rpx;
			
			& + .checkbox-item {
				border-top: 1px solid #B3B3BB;
			}
			.icon-bg {
				position: relative;
				margin-right: 30rpx;
				display: inline-block;
				width: 44rpx;
				height: 44rpx;
				line-height: 44rpx;
				text-align: center;
				color: #fff;
				border-radius: 4rpx;
				background-color: #B3B3BB;
			}
			
			&.active {
				.icon-bg {
					background-color: #F6A704;
				}
			}
		}
	}
} 
</style>
