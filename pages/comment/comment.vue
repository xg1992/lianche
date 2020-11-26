<template>
	<view class="c-container" :style="style" @click.stop="close">
		<view class="c-panel" @click.stop="clear">
			<view class="c-header">
				<text class="c-header-title">{{totalCount}}条评论</text>
				<image @click="close" class="c-btn-close" src="/static/close_icon.png"></image>
			</view>
			<!-- 评论列表 -->
			<scroll-view class="c-list" scroll-y>
				<view class="c-item" v-for="(item,index) in commentsList">
					<view class="c-item-left">
						<image class="c-avatar" :src="$realSrc(item.avatar) || '/static/tx.png'" @click="goUserInfo(item.uid,$event)"></image>
					</view>
					<view class="c-item-right">
						<view @click="goUserInfo(item.uid,$event)">
							<text class="name">{{ item.nickname }}<text class="author-icon" v-if="video_uid == item.uid"></text></text>
						</view>
						<view>
							<text class="content" @click="replyComment(item.id, item.uid, item.nickname)">{{ item.content }}</text>
							<text class="text-delete" @click="delComment(item.id)" v-if="uid==item.uid">删除</text>
						</view>
						<view>
							<text class="time">{{item.create_time|formatTime('{m}-{d}')}}</text>
						</view>
						<!-- 回复列表 -->
						<view class="c-children" v-for="(i,j) in item.reply" :key="j">
							<view class="c-children-left">
								<image class="c-children-avatar" :src="$realSrc(i.avatar) || '/static/tx.png'" @click="goUserInfo(i.uid,$event)"></image>
							</view>
							<view class="c-children-right">
								<view @click="goUserInfo(i.uid,$event)">
									<text class="c-children-name">{{ i.nickname }}<text class="author-icon" v-if="video_uid == i.uid"></text></text>
								</view>
								<view>
									<text class="c-children-content" @click="replyComment(i.id, i.uid, i.nickname, item.id)">{{ i.content }}</text>
									<text class="text-delete" @click="delComment(i.id)" v-if="uid==i.uid">删除</text>
								</view>
								<view>
									<text class="time">{{i.create_time|formatTime('{m}-{d}')}}</text>
								</view>
							</view>
						</view>
						<view class="c-more" v-if="item.reply&&item.reply.length>3" @click.stop="showAllReply(item)">
							<text class="more">—— {{item.showAll?'收起':'展开'}}{{item.showAll?item.totalCount:item.totalCount-item.reply.length}}条回复</text>
							<image class="icon-ud" :src="`/static/icons/icon_${item.showAll?'up':'down'}.png`"></image>
						</view>
					</view>
				</view>
				<view class="c-list-more" @click.stop="load" v-if="commentsList.length>=pagesize">
					<text class="more">———  {{noMore?'没有更多了':'查看更多'}}  ———</text>
				</view>
			</scroll-view>
			<view class="c-footer">
				<input class="c-footer-left" v-model="commentContent" :placeholder="placeholder" :focus="comfocus" @blur="comfocus=false" placeholder-class="c-placeholder"/>
				<text class="c-footer-right" :class="{active: commentContent.length}" @click="submit">发表</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {request} from '@/common/api.js'
	import store from '@/store'
	export default{
		data(){
			return{
				uid:0,
				video_uid:0,
				video_id:0,
				commentsList:[],
				totalCount:0,
				loading:false,
				placeholder:'点击输入评论内容',
				toNickname:'',
				toCommentid:'',
				topCommentid:'',
				toUid:'',
				comfocus:false,
				commentContent:'',
				page:1,
				pagesize:10,
				noMore:false
			}
		},
		computed:{
			style(){
				return {
					height:`${uni.getSystemInfoSync().windowHeight}px`
				}
			}
		},
		onLoad(e) {
			console.log(e);
			this.video_id = e.id
			this.video_uid = e.video_uid
			this.load()
		},
		onShow() {
			let userInfo = store.getters.userInfo
			userInfo && (this.uid = userInfo.uid)
		},
		methods:{
			load(page){
				console.log('加载数据');
				if(this.noMore) return
				if(page && page == 1){
					this.page = 1;
					this.commentsList = [];
				}
				let id = this.video_id
				this.loading = true;
				request('Video/Comment/getCommentsToVideo', {
					videoid: id,
					page: this.page,
					pagesize: this.pagesize
				}).then(res => {
					// console.log(res);
					if(res.data&&res.data.length>0){
						this.page ++
						this.commentsList = this.commentsList.concat(res.data)
					}else{
						this.noMore = true
					}
					console.log(this.page);
					this.totalCount == 0 && (this.totalCount = res.totalCount);
					this.loading = false;
				});
			},
			// 去用户详情页
			goUserInfo(uid,event){
				console.log(uid);
				if (event) {
					event.stopPropagation()
				}
				if (uid == uni.getStorageSync('uid')) {
					uni.switchTab({
						url: '/pages/my/my'
					});
					return false;
				}
				uni.navigateTo({
					url: '/pages/homepage/homepage?uid=' + uid
				});
			},
			showAllReply(item){
				console.log(item);
				const pagesize = 3
				if(!item.replyListPage){
					this.$set(item,'replyListPage',1)
				}
				if(!item.noMore){
					request('Video/Comment/getSonCommentsToVideo', {
						topCommentid: item.id,
						page: item.replyListPage + 1,
						pagesize: pagesize
					}).then(res => {
						console.log(res);
						let list = res.data;
						let replyList = item.reply.concat(list)
						this.$set(item,'reply',replyList)
						if(list.length<pagesize){
							this.$set(item,'showAll',true)
							this.$set(item,'noMore',true)
						}else{
							this.$set(item,'replyListPage',item.replyListPage + 1)
						}
					});
				}else{
					let list = item.reply.splice(0,pagesize)
					this.$set(item,'reply',list)
					this.$set(item,'replyListPage',1)
					this.$set(item,'showAll',false)
					this.$set(item,'noMore',false)
				}
			},
			delComment(id){
				uni.showModal({
					content:"确定删除评论？",
					success: (res) => {
						if(res.confirm){
							request('Video/Comment/delComment', {
								commentid: id
							}).then(res => {
								// console.log(res);
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
								this.load(1)
								uni.$emit('comment',{msg:'删除评论',isDel:1})
							});
						}
					}
				})
			},
			replyComment(id, uid, name, topid){
				if (uid == uni.getStorageSync('uid')) {
					return false;
				}
				this.toNickname = name;
				this.placeholder = '@' + name;
				this.toCommentid = id;
				this.toUid = uid;
				this.topCommentid = topid ? topid : '';
				this.comfocus = true;
			},
			//提交评论
			submit(event) {
				if (event) {
					event.stopPropagation()
				}
				if (!uni.getStorageSync('token')) {
					this.commentshow = false;
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				uni.hideKeyboard(); //点击发表评论,就把键盘收回
				if (this.commentContent) {
					let value = this.commentContent;
					let len = value.match(/[^ -~]/g) == null ? value.length : value.length + value.match(/[^ -~]/g).length;
					if (this.topCommentid == '' && this.toCommentid != '') {
						this.topCommentid = this.toCommentid;
					}
					if (len > 400 || len < 1) {
						uni.showToast({
							title: '评论内容在1-400字之间',
							icon: 'none'
						});
					}
					request('Video/Comment/addVideoComment', {
						videoid: this.video_id,
						toCommentid: this.toCommentid,
						toUid: this.toUid,
						content: this.commentContent,
						_token: uni.getStorageSync('token'),
						toNickname: this.toNickname,
						topCommentid: this.topCommentid
					}).then(res => {
						// console.log(res);
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						if (res.res == 1) {
							this.noMore = false;
							this.load(1)
							this.delaite();
							this.commentContent = '';
							uni.$emit('comment',{msg:'新增评论'})
						}
					});
				}
			},
			delaite() {
				this.placeholder = '请输入评论内容';
				this.toNickname = '';
				this.toCommentid = '';
				this.toUid = '';
				this.topCommentid = '';
				this.aite_stu = false;
			},
			clear(event){
				if (event) {
					event.stopPropagation()
				}
			},
			close(event){
				if (event) {
					event.stopPropagation()
				}
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}
	.c-container{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.c-panel{
		position: absolute;
		bottom: 0;
		left: 0;
		height: 1083rpx;
		width: 750rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		background-color: #FFFFFF;
		text-overflow: fade;
	}
	.c-header{
		height: 96rpx;
		width: 750rpx;
		@include fr(c,c);
	}
	.c-header-title{
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		@include font(30rpx,#191C2F);
		text-align: center;
		line-height: 96rpx;
	}
	.c-btn-close{
		@include size(28rpx);
		position: absolute;
		right: 29rpx;
		top: 29rpx;
	}
	
	.c-list{
		width: 750rpx;
		height: 890rpx;
	}
	.c-item{
		position: relative;
		width: 750rpx;
		@include fr(s,s);
		padding-top: 34rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 50rpx;
	}
	.c-item-left{
		
	}
	.c-avatar{
		@include size(88rpx);
		border-radius: 44rpx;
	}
	.c-item-right{
		width: 465rpx;
		margin-left: 26rpx;
	}
	.name{
		@include font(26rpx,#B3B3BB,800);
	}
	.content{
		@include font(26rpx,#191C2F);
		line-height: 40rpx;
		margin-top: 20rpx;
		margin-right: 20rpx;
	}
	.text-delete{
		display: inline-block;
		@include font(26rpx,#B3B3BB);
	}
	.c-list-more{
		margin-top: 28rpx;
		@include fr(c,c);
		padding-bottom: 30rpx;
	}
	.c-more{
		margin-top: 28rpx;
		@include fr(s,c);
	}
	.more{
		@include font(26rpx,#B3B3BB);
	}
	.icon-ud{
		margin-left: 20rpx;
		@include size(20rpx,10rpx);
	}
	.c-children{
		@include fr(s,s);
		margin-top: 42rpx;
	}
	.c-children-right{
		margin-left: 13rpx;
	}
	.c-children-avatar{
		@include size(40rpx);
		border-radius: 20rpx;
	}
	.c-children-name{
		@include font(26rpx,#191C2F);
		line-height: 40rpx;
	}
	.c-children-content{
		@include font(26rpx,#191C2F);
		line-height: 40rpx;
		margin-right: 20rpx;
	}
	.time{
		@include font(20rpx,#8D8D8D);
	}
	
	.c-footer{
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		width: 750rpx;
		height: 98rpx;
		@include fr(b,c);
		border-top: 1px solid #B3B3BB;
	}
	.c-footer-left{
		width: 620rpx;
		height: 98rpx;
		line-height: 98rpx;
		padding-left: 32rpx;
		padding-right: 32rpx;
		@include font(30rpx,#191C2F);
	}
	.c-footer-right{
		width: 130rpx;
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		@include font(30rpx,#919191);
	}
	.c-placeholder{
		line-height: 98rpx;
		@include font(15px,#C9C9C9);
	}
	.c-footer-right.active {
		@include font(30rpx,orange);
	}
	.author-icon {
		display: inline-block;
		width: 60rpx;
		height: 34rpx;
		line-height: 30rpx;
		margin-left: 15rpx;
		background-color: #F6A704;
		border-radius: 4rpx;
		text-align: center;
		&::before{
			content: "作者";
			@include font(20rpx,#FFFFFF);
		}
	}
</style>
