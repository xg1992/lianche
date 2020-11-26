<template>
	<view class="homepage-content">
		<view class="h_center jc_sb" style="padding: 40rpx 30rpx 10rpx 30rpx;">
			<view class="posre" style="margin-right: 25rpx;">
				<image :src="all.avatar ? $realSrc(all.avatar) + '?time=' + new Date().getTime() : '/static/tx.png'" mode="" style="width: 146rpx;height:146rpx;border-radius: 50%;"></image>
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
			<view class="gzbtn center" >
				<text>关注</text>
			</view>
		</view>
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
			<view class="center font34 colorb3 " :class="type == 1 ? 'nav_active' : ''" >作品</view>
		</view>
		<view class="h_center f_wrap" v-show="type == 1">
			<view class="list_box" v-for="(item, idx) in list" :key="idx" >
				<image :src="$realSrc(item.cover)"></image>
				<view class="item_like">
					<text class="iconfont icon-lc-14"></text>
					{{ item.zans }}
				</view>
			</view>
		</view>
		<browerTip ref="browerTip"></browerTip>
		<view class="center colorb3 hei48 pd15" v-if="list == ''">暂无数据</view>
		<launchapp @error="openAppError" :extinfo="extinfo" launchId="launchApp" v-if="all.username"></launchapp>
	</view>
</template>

<script src="./homepage.js"></script>

<style scoped>
@import url("./homepage.css");
</style>
