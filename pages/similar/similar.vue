<template>
	<view>
		<view class="similar_nav t_center ">
			<image :src="type==1?'../../static/topic_mc.png':$realSrc(all.info.url)"  class="similar_img" @click="tohome"></image>
			<view class="">
				<view class="similar_title">{{all.info.name}}</view>
				<view class="colorb3 font26" style="margin-top:17rpx;">{{all.info.play_number}}次播放</view>
			</view>
		</view>
		<view class="h_center f_wrap">
			<view class="list_box" v-for="(item,idx) in list" :key='idx' @click="tolook(item.id)">
				<image :src="$realSrc(item.cover)"></image>
				<view class="item_like">
					<text class="iconfont icon-lc-18"></text>{{item.recommends}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				all:'',
				type:1,
				list:'',
				page:1
			}
		},
		onLoad(options) {
			this.id=options.id
			this.type=options.type
			if(this.type==1){uni.setNavigationBarTitle({title: '话题'});}else{uni.setNavigationBarTitle({title: '同日预约视频'})}
			this.load()
		},
		methods: {
			load(){
				let that=this
				let act=this.type==1?'Search/Topics/allList':'Video/Video/orderVideos'
				that.$api.request(act, {topicsId:that.id,videoid:that.id}).then(res => {
					console.log(res)
					that.all=res.data
					that.list=res.data.list
				})
			},
			tolook(id, list) {
				let that = this
				let act=this.type==1?'Search/Topics/allList':'Video/Video/orderVideos'
				uni.navigateTo({url: '/pages/video/video?act='+act+'&videoid='+ this.id+'&topicsId='+ this.id});
			},
			tohome(){
				if(this.type==2){
					uni.navigateTo({url: '/pages/homepage/homepage?uid='+this.all.info.coach_id});
				}
			}
		},
		onReachBottom() {
			let that = this
			if(this.type==1){
				let act=this.type==1?'Search/Topics/allList':'Video/Video/orderVideos'
				that.$api.request(act, {
					page: that.page + 1,
					pagesize: 10,
					topicsId:that.id,videoid:that.id
				}).then(res => {
					that.list = that.list.concat(res.data.list)
					if (res.data) {
						that.page = that.page + 1
					}
				})
			}
		},
		onPullDownRefresh() {
			this.page=1
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
.similar_nav{padding: 40rpx 30rpx;}
.similar_img{display: block;width: 200rpx;height: 200rpx;margin-right: 42rpx;}
.list_box{position: relative;width: 33.3%;height:332rpx;}
.list_box image{width: 100%;height: 100%;}
.item_like{position: absolute;bottom:28rpx;left: 19rpx;font-size: 22rpx;}
.item_like .iconfont{font-size: 22rpx;padding-right: 9rpx;}
.similar_title{font-size: 36rpx;color: #E3E3E3;}
</style>
