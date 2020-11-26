<template>
	<view class="pt50">
		<tab class="top-tab" :list="tab" :active="tabFlag" @tab="tabChange"></tab>
		<view class="coupon-list">
			<view class="coupon-item" v-for="(item,index) in couponList">
				<coupon
					:info="item"
					:type="item.type" 
					:status="status" 
					:btnText="btnText" 
					:tagType="item.tagType"
					:closable="closable"
					@onClose="onClose(item,index)"
					@onTopRightText="onTopRightText" 
					@onInfo="toDetail(item)"
					@onBtn="toEdit(item)">
				</coupon>
			</view>
		</view>
		<!-- 右上角新增弹出菜单 -->
		<!-- <gracePopupMenu ref="menu" :zIndex="999" borderRadius="8rpx" @hideMenu="$refs.menu.hide()">
			<view class="menu-item" @click="routeTo('add/coupon_add?couponType=ziying',1)">自营</view>
			<view class="menu-item" @click="routeTo('daifa_coupon?couponType=daifa',2)">代发</view>
		</gracePopupMenu> -->
		
		<list-empty v-if="isEmpty" :top="180" msg="你还没有优惠券，点此新增" img="/static/images/coupon.png" button btn-text="新增"
		 @btnCallback="toAdd" :img-width="360"></list-empty>
	</view>
</template>

<script>
	import tab from '@/components/tab.vue'
	import coupon from '@/components/coupon/index.vue'
	// import gracePopupMenu from '@/graceUI/components/gracePopupMenu.vue'
	import {parseTime} from '@/common/filter.js'
	export default {
		components: {
			tab,
			coupon,
			// gracePopupMenu
		},
		data(){
			return {
				tab: ['待发放','发放中','已结束'],
				tabFlag: 0, // tab的索引项，对应tab数组顺序
				couponList: [],
				status: 1, //优惠券状态，默认正常
				usertype: 1, // 1=认证机构用户，2=普通用户，根据不同用户分类显示不同数据
				btnText: '修改',
				qx: false,
				page: 1,
				pagesize: 20,
				islast: false, // 是否为最后一页，默认false
				closable: true, // 优惠券是否可以删除
				isEmpty: false,
			}
		},
		onLoad(options){
			this.usertype = ~~options.usertype;
			this.qx = this.$api.qx([32,64,512,1024]);
			if(this.usertype === 1){ // 认证机构用户发券
				this.apiUrl = 'Activity/Coupon/getCouponsToWorker';
			}else{ // 普通用户代发
				uni.setNavigationBarTitle({'title': '代发优惠券'})
				this.apiUrl = 'Activity/Coupon/getMyDfCoupons';
			}
			this.getList();
		},
		onNavigationBarButtonTap(e){
			this.toAdd();
			// const menu = this.$refs.menu;
			// menu.showIn ? menu.hide() : menu.open();
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.islast = false;
			this.page = 1;
			this.getList(this.tabFlag);
			uni.stopPullDownRefresh();
		},
		// 页面滚动到底部事件
		onReachBottom(){
			this.getList(this.tabFlag);
		},
		methods: {
			async getList(state){
				if(this.islast) return ;
				await this.$api.request(this.apiUrl,{state:state || 0,page:this.page,pagesize:this.pagesize}).then(res=>{
					let data = res.data;
					if(data.length){
						let list = [];
						for(let i = 0, len = data.length; i < len; i++){
							list[i] = {
								id: data[i].couponId, // 优惠券id
								type: data[i].type, // 优惠券类型，1=抵用券，2=折扣券
								title: data[i].name,  // 优惠券名称
								price: data[i].type === 1 ? data[i].discount / 100 : data[i].discount / 10, // 优惠金额或者折扣
								discountDesc: data[i].rebateThreshold ? '满'+data[i].rebateThreshold / 100+'可用' : '',  // 使用门槛
								desc: data[i].instruction, // 优惠券使用说明
								time: '有效期：' + parseTime(data[i].useStime,'{y}-{m}-{d}') + ' - ' + parseTime(data[i].useEtime,'{y}-{m}-{d}'), // 有效期
								tagType: data[i].giveType === 0 ? 1 : 2, // giveType: 0、自营，1、代发
								giveId: data[i].giveId, // 代发的优惠券id，删除代发的优惠券时的id参数
							}
						}
						if(data.length < this.pagesize) this.islast = true; // 如果返回的数据比分页数量少，说明是最后一页，不再继续拉取数据
						if(this.page === 1) this.couponList = [];
						this.page++;
						this.couponList = this.couponList.concat(list);
						this.isEmpty = false;
					}else if (this.page === 1){
						this.couponList = [];
						this.isEmpty = true;
					}
				}).catch((res)=>{
					if(this.page === 1){
						this.isEmpty = true;  
					}
				})
			},
			async tabChange(params){
				this.tabFlag = params.index;
				this.islast = false;
				this.page = 1;
				await this.getList(params.index)
				if(this.tabFlag === 0){ // 只有待发放的优惠券才可以删除
					this.closable = true;
				}else{
					this.closable = false;
				}
			},
			onTopRightText(item){
				uni.navigateTo({
					url: 'rule_detail'
				})
			},
			onClose(item,index){
				this.$confirm({
					content: '确定删除优惠券吗？',
					confirm:()=>{
						console.log('确定删除')
						let id = item.id;
						let giveId = item.giveId;
						this.$api.request('Activity/Coupon/deleteCoupon',{couponId: id,giveId:giveId}).then(res=>{
							if(res.res === 1){
								uni.showToast({
									title: '删除成功！',
									icon: 'none'
								})
								this.couponList.splice(index,1)
							}
						})
					}
				})
			},
			// 查看详情
			toDetail(item){
				console.log(item)
				if(item.tagType === 2){
					uni.navigateTo({
						url: 'daifa_detail?id=' + item.id || 1
					})
				}else{
					uni.navigateTo({
						url: `detail?id=${item.id}&usertype=${this.usertype}`,
					})
				}
			},
			// 去新增
			// routeTo(url,from){
			// 	if(from === 1 && !this.qx){
			// 		this.$api.Toast('认证机构才能发放自营优惠券')
			// 		return ;
			// 	}
			// 	uni.navigateTo({
			// 		url,
			// 	})
			// 	this.$refs.menu.hide()
			// },
			// 去修改
			toEdit(item){
				let url = `add/coupon_add?id=${item.id}`;
				if(item.tagType === 2){
					url = 'daifa_detail?isEdit=1&id='+item.giveId;
				}
				uni.navigateTo({
					url,
				})
			},
			toAdd(){
				if(this.usertype === 1){
					uni.navigateTo({
						url: 'add/coupon_add'
					})
				}else{
					uni.navigateTo({
						url: 'daifa_coupon'
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.pt50 {
	padding-top: 100rpx;
	position: relative;
}
.coupon-list {
	padding: 30rpx;
}
.coupon-item {
	display: flex;
	justify-content: center;
}
.coupon-item + .coupon-item {
	margin-top: 30rpx;
}
.top-tab {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 99;
	background-color: #191C2F;
}
.menu-item {
	color: #333;
	padding: 20rpx;
	text-align: center;
	
	+ .menu-item {
		border-top: 1px solid #ddd;
	}
}
</style>
