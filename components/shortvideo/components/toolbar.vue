<template>
	<view class="userInfo" @appear="" @Disappear="$parent.videohide(i)" :bubble="true">
		<view class="posre" bubble="true">
			<image class="userAvatar" :src="item.avatar ? $realSrc(item.avatar) : '/static/tx.png'" @click="$parent.tohome(item.uid)"></image>
			<image src="../../static/gz.png" class="gb_btn" @click="$parent.follow" v-if="item.is_fans_it == 0 && item.uid !== $parent.uid"></image>
		</view>
		<!-- 关注 -->
		<view class="like" @click="$parent.cLike">
			<image class="likeIco" :src="item.operation == 1 ? '../../static/img/index/xinActive.png' : '../../static/img/index/xin.png'" />
			<text class="likeNum">{{ item.zans }}</text>
		</view>
		<!-- 评论 -->
		<view class="comment" @click="$parent.toComment(i)">
			<image class="commentIco" src="@/static/img/index/comment.png" style="width: 64rpx;height:62rpx"></image>
			<text style="color: #FFFFFF;text-align: center;font-size: 24rpx;margin-top: 14rpx;">{{ item.talks }}</text>
		</view>
		<!-- 分享 -->
		<view class="share" @click="$parent.share">
			<image class="shareIco" src="@/static/img/index/share.png" style="width: 62rpx;height:62rpx"></image>
			<text class="shareTex">{{ item.shares }}</text>
		</view>
		<view class="recommend">
			<view class="recommend_tx" v-if="item.training_order_id > 0" @click="$parent.tosimilar(2, item.video_id)">
				<image src="@/static/recommend_bg.png" class="recommend_bg"></image>
				<image class="recommendIco" src="@/static/tx.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { realSrc } from "@/common/common.js"
	export default {
		props: ['item','i'],
		data(){
			return {
				
			}
		},
		methods:{
			$realSrc:realSrc
		}
	}
</script>

<style scoped>
.userInfo {
	position: absolute;
	bottom: 20px;
	right: 15px;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.gb_btn {
	width: 38rpx;
	height: 38rpx;
	position: absolute;
	bottom: 20rpx;
	left: 31rpx;
}
.userAvatar {
	border-radius: 50%;
	margin-bottom: 15px;
	border-style: solid;
	border-width: 2px;
	border-color: #ffffff;
}

.userAvatar {
	width: 98upx;
	height: 98upx;
}

.likeIco,
.shareIco,
.commentIco {
	width: 66upx;
	height: 62upx;
	margin-top: 15px;
}

.likeNum,
.commentNum,
.shareTex {
	color: #ffffff;
	font-size: 24upx;
	text-align: center;
	margin: 5px;
}

.likeNumActive {
	color: red;
}

.recommend {
	margin-top: 68rpx;
	width: 96rpx;
	height: 96rpx;
}

.recommend_tx {
	border-radius: 50%;
	justify-content: center;
	align-items: center;
	width: 96rpx;
	height: 96rpx;
	position: relative;
}

.recommend_bg {
	position: absolute;
	left: 0;
	top: 0;
	width: 96rpx;
	height: 96rpx;
}

.recommendIco {
	width: 70upx;
	height: 70upx;
}

</style>
