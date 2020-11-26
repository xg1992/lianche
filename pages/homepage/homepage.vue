<template>
	<view>
		<view class="h_center jc_sb" style="padding: 40rpx 30rpx 10rpx 30rpx;">
			<view class="posre" style="margin-right: 25rpx;">
				<image :src="$realSrc(all.avatar) ? $realSrc(all.avatar) + '?time=' + new Date().getTime() : '/static/tx.png'" mode=""
				 style="width: 146rpx;height:146rpx;border-radius: 50%;"></image>
				<text class="coach_icon" v-if="all.roleVal & 16">教练</text>
				<text class="student_icon" v-if="all.roleVal & 8">学员</text>
			</view>
			<view class="f_grow">
				<view class="">
					<text class="font36 bold">
						{{ all.nickname }}
						<text class="iconfont icon-lc-38" style="color:#6982fa" v-if="all.sex == 1"></text>
						<text class="iconfont icon-lc-54" style="color:#ff6562" v-if="all.sex == 2"></text>
					</text>
					<text class="user_icon" v-if="all.roleVal & 16">教龄 {{ all.ofSchoolAge>0?all.ofSchoolAge:0 }} 年</text>
				</view>
				<view class="font26 colorb3" style="margin-top: 20rpx;">链车号：{{ all.username }}</view>
				<view class="font26 colorb3 grace-ellipsis" style="margin-top: 10rpx; width: 340rpx;" v-if="all.roleVal & 16 && all.ofSchoolAge">驾校：广州永通驾校</view>
			</view>
			<view class="gzbtn center" :class="all.hadFollow ? 'qxgzbtn' : ''" @click="follow">{{ all.hadFollow ? '已关注' : '关注' }}</view>
		</view>
		<navigator class="gift" :url="'./welfare?institutionId='+institutionId" v-if="!!institutionId">
			<view class="g-left">
				<image class="g-icon" src="/static/icons/gift.png" mode="widthFix"></image>
				<text>橱窗福利</text>
			</view>
			<view class="iconfont icon-arrow-right"></view>
		</navigator>
		<view class="user-introduction" :class="{'show-all': isShowMore}" v-if="all.intro">
			简介：{{ all.intro }}
			<text class="show-more" @click="showMore">{{isShowMore ? '<收起': '更多>'}}</text>
		</view>
		<view class="h_center jc_sa" style="height: 96rpx;">
			<view class="center">
				<text class="pdy20 font36 bold">{{ all.zans }}</text>
				<text class="colorb3 font24">获赞数</text>
			</view>
			<view class="center">
				<text class="pdy20 font36 bold">{{ all.follows }}</text>
				<text class="colorb3 font24">关注</text>
			</view>
			<view class="center">
				<text class="pdy20 font36 bold">{{ all.fans }}</text>
				<text class="colorb3 font24">粉丝</text>
			</view>
		</view>
		<view class="" v-if="navtop" style="height: 96rpx;"></view>
		<view class="h_center jc_sa nav_box" :class="navtop ? 'topnav' : ''">
			<view class="center font34 colorb3 " :class="type == 1 ? 'nav_active' : ''" @click="nav(1)">作品</view>
			<view class="center font34 colorb3 " :class="type == 2 ? 'nav_active' : ''" @click="nav(2)">喜欢</view>
			<view class="center font34 colorb3 " :class="type == 3 ? 'nav_active' : ''" @click="nav(3)">课程</view>
		</view>
		<view class="h_center f_wrap" v-show="type == 1">
			<view class="list_box" v-for="(item, idx) in list" :key="idx" @click="tolook(item.videoId)">
				<image :src="$realSrc(item.tiny_cover ? item.tiny_cover : item.cover)"></image>
				<view class="item_like">
					<text class="iconfont icon-lc-14"></text>
					{{ item.zans }}
				</view>
				<view class="video-istop" v-if="item.istop > 0">
					<view class="istop-center">
						<text class="font24">置顶</text>
					</view>
				</view>
			</view>
		</view>
		<view class="h_center f_wrap" v-show="type == 2">
			<view class="list_box" v-for="(item, idx) in list" :key="idx" @click="tolook(item.videoId)">
				<image :src="$realSrc(item.tiny_cover ? item.tiny_cover : item.cover)"></image>
				<view class="item_like">
					<text class="iconfont icon-lc-14"></text>
					{{ item.zans }}
				</view>
			</view>
		</view>
		<view class="" v-show="type == 3">
			<view class="video_gather " v-for="(item, idx) in list" :key="idx">
				<view class="h_center font34">
					<text class="pdy20">{{ item.day }}</text>
				</view>
				<view class="" style="margin: 30rpx 0;">
					<view class="font26">
						<text class=" color8d">内容：</text>
						<text>{{item.content ? item.content : '科二实操'}}</text>
					</view>
					<view class="font26 mgto10">
						<text class=" color8d">学员：</text>
						<text>{{ item.nicknames }}</text>
					</view>
				</view>
				<scroll-view scroll-x class="scroll_video">
					<view class="list_box" v-for="(i, index) in item.list" :key="index" @click="tolook(i.id, item)">
						<image :src="$realSrc(i.tiny_cover ? i.tiny_cover : i.cover)"></image>
						<view class="item_like">
							<text class="iconfont icon-lc-14"></text>
							{{ i.zans }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="center colorb3 hei48 pd15" v-if="list == ''">暂无数据</view>
		<share2 ref="share" :options="shareOptions"></share2>
	</view>
</template>

<script src="./homepage.js"></script>

<style scoped lang="scss">
	@import url("./homepage.css");

	.gift {
		@include size(690rpx, 96rpx);
		background-color: #2E3045;
		border-radius: 16rpx;
		margin: 40rpx 30rpx;
		padding: 0 40rpx;
		@include fr(b, c);
		.g-left {
			@include fr(s, c);
			.g-icon {
				@include size(31rpx, 35rpx);
			}
			text{
				margin-left: 16rpx;
				@include font(34rpx,#FFFFFF);
			}
		}
	}
</style>
