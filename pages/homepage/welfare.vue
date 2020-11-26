<template>
	<view class="main">
		<view class="list" v-if="couponList.length>0">
			<view class="item" v-for="(item,index) in couponList" :keys="index">
				<coupon :type="item.type" :info="item" :status="item.status" top-right-text="规则" invalid @onTopRightText="onTopRightText" @onBtn="toGet(item)"></coupon>
			</view>
		</view>
		<list-empty img="/static/images/coupon.png" msg="暂无可领取福利" v-else-if="isEmpty"></list-empty>
	</view>
</template>

<script>
	import coupon from '@/components/coupon/index.vue'
	import {parseTime} from '@/common/filter.js'
	export default{
		components:{
			coupon
		},
		data(){
			return {
				couponList:[],
				page: 1,
				pagesize: 20,
				institutionId: null, // 机构id,获取优惠券需要此参数
				islast: false,
				isEmpty: false,
			}
		},
		onLoad(options) {
			this.institutionId = ~~options.institutionId;
			this.getList()
		},
		onPullDownRefresh() {
			this.getList();
			uni.stopPullDownRefresh()
		},
		methods:{
			getList(){
				this.$api.request('Activity/Coupon/getCoupons',{page:this.page,pagesize:this.pagesize,institutionId:this.institutionId}).then(res=>{
					let data = res.data;
					if(data.length){
						let list = [];
						for(let i = 0, len = data.length; i < len; i++){
							list[i] = {
								id: data[i].couponId, // 优惠券id
								type: data[i].type, // 优惠券类型，1=抵扣券，2=折扣券
								title: data[i].name,  // 优惠券名称
								price: data[i].type === 1 ? data[i].discount / 100 : data[i].discount / 10, // 优惠金额或者折扣
								discountDesc: data[i].rebateThreshold ? '满'+data[i].rebateThreshold / 100+'可用' : '',  // 使用门槛
								desc: data[i].instruction, // 优惠券使用说明
								time: '有效期：' + parseTime(data[i].useStime,'{y}-{m}-{d}') + ' - ' + parseTime(data[i].useEtime,'{y}-{m}-{d}'), // 有效期
								tagType: 0, //  0、自营，1、代发
							}
						}
						if(data.length < this.pagesize) this.islast = true; // 如果返回的数据比分页数量少，说明是最后一页，不再继续拉取数据
						if(this.page === 1) this.couponList = [];
						this.page++;
						this.couponList = this.couponList.concat(list);
						this.isEmpty = false;
					}else if (this.page === 1){
						this.isEmpty = true;
						this.couponList = [];
					}
				})
			},
			onTopRightText(item){
				uni.navigateTo({
					url: '/pages/my/discount/rule_detail'
				})
			},
			toGet(item){
				this.$api.Toast('领取成功')
				// this.$api.request('Activity/Coupon/getCoupons',{page:this.page,pagesize:this.pagesize,institutionId:this.institutionId}).then(res=>{
					
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		.item{
			@include fr(c,c);
			margin-top: 40rpx;
		}
	}
</style>
