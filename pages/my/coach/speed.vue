<template>
	<view>
		<view class="box" v-for="(item,index) in list" :key='index'>
			<view class="pd15" style="background-color: #2E3045;">
				<view class="h_center">
					<text class="bold">{{item.day}}</text>
					<text class="font26 colorb3">（{{item.start_time}}-{{item.end_time}}）</text>
				</view>
				<view class="font26">{{api.speed(item.speed)}}  累计学时：{{item.totaltime}}</view>
			</view>
			<view class="pd15" style="background-color:rgba(46,48,69,0.5);">
				<scroll-view scroll-x class="scroll_video">
					<view class="list_box" v-for="(i,idx) in item.videoList" :key='idx' @click="tolook(i.id,item.videoList)">
						<image :src="$realSrc(i.cover)"></image>
					</view>
				</scroll-view>
				<text class="mgto26">培训笔记</text>
				<view class="font26 colorb3 mgto26">{{item.comment}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				api:this.$api,
				page:1,
				list:'',
				id:'100009',
				
			}
		},
		onLoad(options) {
			// this.id=options.id
			this.load()
		},
		methods: {
			load(){
				let that=this
				that.$api.request('Appointment/Appointment/speedShow', {uid:this.id}).then(res => {
					that.list=res.data
				})
			},
			tolook(id,list){
				// console.log(list)
				let that=this
				let act='Appointment/Appointment/speedShow'
				let ids=[]
				list.forEach(item => {
				  ids.push(item.videoId)
				})
				uni.navigateTo({url: '/pages/video/video?act='+act+'&uid='+this.id+'&ids='+ids.join()+'&typeShow=1'});
			}
		},
		onReachBottom() {
			let that=this
			that.$api.request('Appointment/Appointment/speedShow', {page: that.page+1,pagesize: 10,studentsId: that.id}).then(res => {
				that.list=that.list.concat(res.data)
				if(res.data){that.page=that.page+1}
			})
		},
		onPullDownRefresh() {
			this.type=1;this.page=1
			this.load()
			uni.stopPullDownRefresh();
			
		}
	}
</script>

<style>
.box{margin: 30rpx;border-radius: 16rpx;overflow: hidden;}
.scroll_video{display: inline-block; white-space: nowrap;width: 100%;}
.scroll_video .list_box{width:200rpx;margin-right: 5rpx;display: inline-block;height:264rpx;}
.list_box{position: relative;width:200rpx;height:264rpx;border-radius: 8rpx;margin-right: 12rpx;}
.list_box image{width: 100%;height: 100%;}
</style>
