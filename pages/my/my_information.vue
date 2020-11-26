<template>
	<view>
		<block v-if="type==3">
			<view class="list" v-for="(item,idx) in list" :key='idx' >
				<image class="portrait_img" :src="item.avatar?$realSrc(item.avatar):'/static/tx.png'" @click="tohome(item.uid)"></image>
				<view class="list_text" @click="tovideo(item.uid,item.videoId)">
					<text>{{item.nickname}}</text>
					<text class="mgto26">{{item.content}}</text>
					<view class="mgto26 font26">评论了<text>{{item.type==1?'你的作品':'你的评论'}}</text><text class="font26 colorb3 pdz20">{{date.fromTimer(item.create_time)}}</text></view>
				</view>
				<image :src="$realSrc(item.cover)" class="works_img" @click="tovideo(item.uid,item.videoId)"></image>
			</view>
		</block>
		<block v-if="type==2">
			<view class="list" v-for="(item,idx) in list" :key='idx' >
				<image class="portrait_img" :src="item.avatar?$realSrc(item.avatar):'/static/tx.png'" @click="tohome(item.uid)"></image>
				<view class="list_text" @click="tovideo(item.uid,item.videoId)">
					<text>{{item.nickname}}</text>
					<view class="mgto26 font26">@了你<text class="font26 colorb3 pdz20">{{date.fromTimer(item.create_time)}}</text></view>
				</view>
				<image :src="$realSrc(item.cover)" class="works_img" @click="tovideo(item.uid,item.videoId)"></image>
			</view>
		</block>
		<block v-if="type==1">
		<view class="list" v-for="(item,idx) in list" :key='idx' >
			<image class="portrait_img" :src="item.avatar?$realSrc(item.avatar):'/static/tx.png'" @click="tohome(item.uid)"></image>
			<view class="list_text" @click="tovideo(item.uid,item.videoId)">
				<text>{{item.nickname}}</text>
				<text class="mgto26">赞了<text>{{item.event_type==1?'你的作品':'你的评论'}}</text></text>
				<view class="mgto26">{{date.fromTimer(item.create_time)}}</view>
			</view>
			<image :src="$realSrc(item.cover)" class="works_img" @click="tovideo(item.uid,item.videoId)"></image>
		</view>
		</block>
		<list-empty v-if="!list || list.length==0" :msg="msg"></list-empty>
	</view>
</template>

<script>
	import date from '../../graceUI/jsTools/date.js';
	export default {
		data() {
			return {
				date,
				type:1,
				list:'',
				page:1,
				msg:''
			}
		},
		onLoad(options) {
			this.type=options.type
			this.load()
		},
		methods: {
			load(){
				let that=this
				let title,act;
				if(this.type==1){act='My/Msg/msgZan',title='赞我的'}
				if(this.type==2){act='My/Msg/msgAite',title='@我的'}
				if(this.type==3){act='My/Msg/msgComments',title='评论'}
				uni.setNavigationBarTitle({title:title});
				that.$api.request(act, {}).then(res => {
					// console.log(res)
					that.list=res.data
					that.msg = res.msg
				})
			},
			tovideo(uid,videoid){
				// console.log(uid,videoid)
				uni.navigateTo({
					url: '/pages/video/video?act=Video/Works/videoByIdsShow&uid='+uid+'&ids='+videoid,});
			},
			tohome(uid){
				uni.navigateTo({url: '/pages/homepage/homepage?uid='+uid});
			}
		},
		onReachBottom() {
			let that=this
			let act;
			if(this.type==1){act='My/Msg/msgZan'}
			if(this.type==2){act='My/Msg/msgAite'}
			if(this.type==3){act='My/Msg/msgComments'}
			that.$api.request(act, {page:this.page+1}).then(res => {
				that.list=that.list.concat(res.data)
				that.msg = res.msg
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
.list{display: flex;align-content: flex-start;justify-content: space-between;padding: 30rpx;}
.portrait_img{width: 88rpx;height: 88rpx;margin-right: 26rpx;border-radius: 50%;display: block;}
.works_img{width: 137rpx;height: 137rpx;padding-left: 26rpx;}
.list_text{display: flex;flex-direction: column;align-content: center;flex-grow: 1;}
</style>
