<template>
	<view class="">
		<uni-swipe-action>
			<uni-swipe-action-item class="view-item" @click="onClick" @change="change" v-for="(item,index) in list">
					<view class="view-item-content">
							<image class="headimg" src="../../../components/coupon/static/coupon-bg-2.png" mode=""></image>
							<view class="info">
								<view class="name">{{item.name}}</view>
								<view class="phone">手机：{{item.phone}}</view>
								<view class="phone">权限：发放优惠券、核销优惠券</view>
							</view>
							<text class="edit-btn" @click="openDialog">修改权限</text>
					</view>
					<template v-slot:right>
							<view class="operation-view"><text class="grace-icons icon-remove" @click="remove(1,item.name,index)"></text></view>
					</template>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<list-empty v-if="isEmpty" :top="180" msg="当前暂无工作人员" img="/static/images/dl.png" button btn-text="添加"
		@btnCallback="toAdd" :img-width="360"></list-empty>
		 
		<lcDialog ref="dialog" :isCloseBtn="false" @confirm="confirm">
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
				list: [{name: '东风不摆',phone: '13428288427', authority:[1,2]}],
				isEmpty: false,
				page: 1,
				checkedList: [1]
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: 'verification_people_add'
			})
		},
		methods: {
			getList(){
				this.$api.request('url',{id,page:this.page}).then(res=>{
					console.log(res)
					if(res.data.length) {
						this.page++
					}else{
						this.isEmpty = true;
					}
				})
			},
			onClick(e){
				console.log(e)
			},
			change(e){
				console.log(e)
			},
			remove(id,name,index){
				console.log(id,name);
				this.$confirm({
					content: `是否删除工作人员"${name}"？`,
					confirmBtnText: '是',
					cancelBtnText: '否',
					confirm:()=>{
						console.log(123)
						this.$api.request('url',{id}).then(res=>{
							console.log(res)
							if(res.res === 1){
								this.list.splice(index,1)
							}
						})
					}
				})
				
			},
			toAdd(){
				uni.navigateTo({
					url: 'verification_people_add'
				})
			},
			// 选择权限事件
			selected(item){
				let index = this.checkedList.indexOf(item)
				if(this.checkedList.indexOf(item) >= 0){
					this.checkedList.splice(index,1)
				}else{
					this.checkedList.push(item)
				}
			},
			openDialog(){
				this.$refs.dialog.open()
			},
			confirm(){
				console.log('确定继续！',this.checkedList)
			},
		}
	}
</script>

<style lang="scss" scoped>
.view-item {
	border-bottom: 1px solid #3A3C55;
	.view-item-content {
		position: relative;
		width: 100%;
		height: 200rpx;
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
		.edit-btn {
			position: absolute;
			right: 30rpx;
			top: 30rpx;
			display: inline-block;
			width: 144rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: #2E3045;
			border: 1px solid #3A3C55;
			border-radius: 8rpx;
			font-size: 24rpx;
			text-align: center;
		}
	}
	.operation-view {
		width: 200rpx;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #24263A;
		
		.grace-icons {
			width: 74rpx;
			height: 74rpx;
			line-height: 74rpx;
			text-align: center;
			background: #FF6562;
			font-size: 52rpx;
			border-radius: 50%;
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
