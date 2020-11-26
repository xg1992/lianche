<template>
	<view>
		<view class="new_nav h_center jc_sa">
			<navigator class="new_nav_item" url="my_information?type=1" hover-class="none">
				<image src="../../static/like.png" mode=""></image>
				<text>赞</text>
			</navigator>
			<navigator class="new_nav_item" url="my_information?type=2" hover-class="none">
				<image src="../../static/call.png" mode=""></image>
				<text>@我的</text>
			</navigator>
			<navigator class="new_nav_item" url="my_information?type=3" hover-class="none">
				<image src="../../static/comment.png" mode=""></image>
				<text>收到的评论</text>
			</navigator>
		</view>
		<view class="new_list" v-for="(i,k) in list" :key='k'>
			<image src="../../static/Notice.png" mode="" class="news_img"></image>
			<view class="new_list_item_right">
				<!-- <view class=""> <text>系统通知</text> <text class="news_type">举报反馈</text></view> -->
				<view class=""> <text>系统通知</text></view>
				<view class="mgto26">{{i.words}}</view>
				<view class="font26 colorb3 mgto40">{{i.create_time}}</view>
			</view>
		</view>
		<list-empty v-if="!list || list.length==0" :top="100" msg="暂无消息"></list-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page:1,
				list:'',
			}
		},
		onLoad() {
			this.load()
		},
		methods: {
			load(){
				let that=this
				that.$api.request('My/Msg/readList', {send_type:2,type_user:1,read_type:1}).then(res => {
					// console.log(res)
					that.list=res.data.list
				})
			}
		},
		onReachBottom() {
			let that=this
			that.$api.request('My/Msg/readList', {page:this.page+1,send_type:2,type_user:1,read_type:1}).then(res => {
				that.list=that.list.concat(res.data.list)
				if(res.data){that.page=that.page+1}
			})
		},
		onPullDownRefresh() {
			this.page=1
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
.new_nav{height: 288rpx;border-bottom:1px solid #24263a;}
.new_nav_item{flex-direction:column;display: flex;align-items: center;justify-content: center;}
.new_nav_item image{width:88rpx;height: 88rpx;margin-bottom: 32rpx;}
.new_list{padding: 30rpx;border-bottom:1px solid #24263a;overflow: hidden;}
.news_img{width: 88rpx;height: 88rpx;margin-right: 26rpx;display: block;float: left;}
.new_list_item_right{float: left;width: 80%;}
.news_type{padding: 6rpx 17rpx;background-color: #2E3045;border-radius:8rpx;color:#B3B3BB;font-size: 20rpx;margin-left: 16rpx;}
</style>
