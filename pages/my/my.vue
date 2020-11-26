<template>
	<view>
		<!-- 头部区域 -->
		<view class="grace-ucenter-header">
			<view style="height:20rpx;"></view>
			<!-- <view class="grace-ucenter-body grace-nowrap grace-flex-vcenter"> -->
			<view class="grace-space-between h_center" v-if="all">
				<navigator url="./information" hover-class="none" class="grace-flex h_center">
					<view class="grace-padding">
						<image class="grace-ucenter-face-img" :src="all.avatar ? $realSrc(all.avatar) + '?time=' + new Date().getTime() : '/static/tx.png'"></image>
					</view>
					<view class="grace-columns">
						<view class="grace-h4">
							{{ all.nickname }}
							<text class="iconfont icon-lc-38" style="color:#6982fa" v-if="all.sex == 1"></text>
							<text class="iconfont icon-lc-54" style="color:#ff6562" v-if="all.sex == 2"></text>
						</view>
						<view class="grace-desc grace-gray">链车号：{{ all.username }}</view>
					</view>
				</navigator>
				<view class="status-badge center" :style="all.userSign == 1 ? 'color: #B3B3BB;' : 'color: #F6A704;'" v-if="all.userSign != -1"
				 @click="Signin">
					{{ all.userSign == 1 ? '已签到' : '签到' }}
				</view>
			</view>
			<view class="grace-space-between h_center" v-if="!all" style="padding-bottom: 54rpx;">
				<navigator url="/pages/login/login" hover-class="none" class="grace-flex h_center">
					<view class="grace-padding">
						<image class="grace-ucenter-face-img" src="/static/tx.png"></image>
					</view>
					<view class="grace-columns">
						<view class="grace-h4">暂未登录,点击登录</view>
					</view>
				</navigator>
			</view>
			<view class="user-desc" v-if="all.intro">{{ all.intro }}</view>

			<view class="grace-ucenter-body" v-if="all">
				<view class="grace-box-banner grace-margin-top">
					<view class="garce-items">
						<view class="follow-data-line1">{{ all.zans }}</view>
						<view class="follow-data-line2">获赞</view>
					</view>
					<navigator class="garce-items" hover-class="none" url="/pages/shortvideo/follows?type=1">
						<view class="follow-data-line1">{{ all.follows }}</view>
						<view class="follow-data-line2">关注</view>
					</navigator>
					<navigator class="garce-items" hover-class="none" url="/pages/shortvideo/follows?type=2">
						<view class="follow-data-line1">{{ all.fans }}</view>
						<view class="follow-data-line2">粉丝</view>
					</navigator>
				</view>
			</view>
		</view>
		<!-- 128:商家,64:总部负责人,32:分部负责人,16:教练, 8:学员,4:老司机,2:未报名,1:游客 -->
		<!-- <view class="grace-body"  v-if="this.$api.qx([8,16,32,64,128])">
            <view style="height:41rpx;"></view>
            <view class="grace-ucenter-funs">
                <view class="grace-grids">
                    <navigator url="/pages/appointment/appointment" open-type="switchTab" hover-class="none" class="items" v-if="this.$api.qx([16])">
                        <view class="icon">
                            <text class="iconfont icon-lc-12 colorzth" ></text>
                        </view>
                        <view class="text text-df">我的排班</view>
                    </navigator>
                    <navigator url="/pages/my/coach/students_speed" hover-class="none" class="items" v-if="this.$api.qx([16])">
                        <view class="icon">
                            <text class="iconfont icon-lc-8 colorzth"></text>
                        </view>
                        <view class="text">学员进度</view>
                    </navigator>
                    <navigator url="./record" hover-class="none" class="items" v-if="this.$api.qx([8,32,64])">
                        <view class="icon">
                            <text class="iconfont icon-lc-12 colorzth" ></text>
                        </view>
                        <view class="text text-df">预约记录</view>
                    </navigator>
                    <navigator url="./my_learning" hover-class="none" class="items" v-if="this.$api.qx([8,32,64])">
                        <view class="icon">
                            <text class="iconfont icon-lc-8 colorzth"></text>
                        </view>
                        <view class="text">学习进度</view>
                    </navigator>
                    <navigator url="./drivers_school" hover-class="none" class="items">
                        <view class="icon">
                            <text class="iconfont icon-lc-5 colorzth" ></text>
                        </view>
                        <view class="text">我的驾校</view>
                    </navigator>
                    <navigator url="./my_works" hover-class="none" class="items">
                        <view class="icon">
                            <text class="iconfont icon-lc-4 colorzth" ></text>
                        </view>
                        <view class="text">我的作品</view>
                    </navigator>
                </view>
            </view>
        </view> -->
		<view class="funs-menu grace-list"></view>
		<view class="grace-body2">
			<!-- 通用功能 -->
			<view class="funs-menu grace-list" v-if="all">
				<navigator class="items items-border" url="/pages/my/my_works" hover-class="none">
					<view class="iconfont icon-lc-4 "></view>
					<view class="body">
						<view class="title grace-h5">我的作品</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="account" hover-class="none">
					<view class="iconfont  icon-lc-7 "></view>
					<view class="body">
						<view class="title grace-h5">我的账户</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="Invitation" hover-class="none">
					<view class="iconfont  icon-lc-6 "></view>
					<view class="body">
						<view class="title grace-h5">我的邀请</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="invitation_code" hover-class="none">
					<view class="iconfont  icon-lc-33 "></view>
					<view class="body">
						<view class="title grace-h5">填写邀请码</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items" url="news" hover-class="none">
					<view class="iconfont  icon-lc-1 "></view>
					<view class="body">
						<view class="title grace-h5">我的消息</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<!-- <navigator class="items items-border" url="/pages/verification/coach?type=3" hover-class="none">
					<view class="iconfont  icon-lc-3"></view>
					<view class="body">
						<view class="title grace-h5">教练认证</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="/pages/verification/coach?type=2" hover-class="none">
				    <view class="iconfont  icon-lc-3"></view>
				    <view class="body"><view class="title grace-h5">分部认证</view></view>
				    <view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="/pages/verification/coach?type=1" hover-class="none">
					<view class="iconfont  icon-lc-3"></view>
					<view class="body">
						<view class="title grace-h5">总部认证</view>
					</view>
					<view class="arrow-right"></view>
				</navigator> -->
				<navigator class="items items-border" url="qualification" hover-class="none">
					<view class="iconfont icon-lc-3"></view>
					<view class="body">
						<view class="title grace-h5">资质认证</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
			</view>
			<!-- 学员 -->
			<view class="funs-menu grace-list" v-if="this.$api.qx([8],roleVal)">
				<navigator class="items items-border" url="./record" hover-class="none">
					<view class="iconfont icon-lc-12 "></view>
					<view class="body">
						<view class="title grace-h5">预约记录</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<!-- <navigator class="items items-border" url="/pages/my/drivers_school" hover-class="none">
                    <view class="iconfont  icon-lc-5"></view>
                    <view class="body"><view class="title grace-h5">我的驾校</view></view>
                    <view class="arrow-right"></view>
                </navigator> -->
			</view>

			<!-- 教练 -->
			<view class="funs-menu grace-list" v-if="this.$api.qx([16],roleVal)">
				<navigator class="items items-border" url="coach/Scheduling" hover-class="none">
					<view class="iconfont  icon-lc-70 "></view>
					<view class="body">
						<view class="title grace-h5">教学排班</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="/pages/my/coach/students_speed" hover-class="none">
					<view class="iconfont icon-lc-8"></view>
					<view class="body">
						<view class="title grace-h5">学员进度</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="coach/students" hover-class="none">
					<view class="iconfont  icon-lc-71 "></view>
					<view class="body">
						<view class="title grace-h5">我的学员</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="coach/speed" hover-class="none">
					<view class="iconfont  icon-lc-68 "></view>
					<view class="body">
						<view class="title grace-h5">学员笔记</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="coach/address/list" hover-class="none">
					<view class="iconfont icon-lc-21 "></view>
					<view class="body">
						<view class="title grace-h5">我的训练场</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="/pages/my/drivers_school" hover-class="none">
				    <view class="iconfont  icon-lc-5"></view>
				    <view class="body"><view class="title grace-h5">我的驾校</view></view>
				    <view class="arrow-right"></view>
				</navigator>
			</view>
			<!-- 分部 -->
			<view class="funs-menu grace-list" v-if="this.$api.qx([32],roleVal)">
				<navigator class="items items-border" url="/pages/generalschool/list/list" hover-class="none">
					<view class="iconfont  icon-lc-68 "></view>
					<view class="body">
						<view class="title grace-h5">我的总部</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="coach/students" hover-class="none">
				    <view class="iconfont  icon-lc-71 "></view>
				    <view class="body"><view class="title grace-h5">我的学员</view></view>
				    <view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="/pages/generalschool/scheduling/set" hover-class="none">
				    <view class="iconfont icon-lc-12"></view>
				    <view class="body">
				        <view class="title grace-h5">排班设置</view>
				    </view>
				    <view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="/pages/generalschool/scheduling/index" hover-class="none">
				    <view class="iconfont icon-lc-70"></view>
				    <view class="body">
				        <view class="title grace-h5">教学排班</view>
				    </view>
				    <view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="coach/address/list" hover-class="none">
					<view class="iconfont icon-lc-21 "></view>
					<view class="body">
						<view class="title grace-h5">我的训练场</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
                <navigator class="items items-border" url="/pages/my/coach/coach_list" hover-class="none">
                    <view class="iconfont  icon-lc-63 "></view>
                    <view class="body"><view class="title grace-h5">分部教练</view></view>
                    <view class="arrow-right"></view>
                </navigator>
                <!-- <navigator class="items" url="coach/students" hover-class="none">
                    <view class="iconfont  icon-lc-71 "></view>
                    <view class="body"><view class="title grace-h5">分部学员</view></view>
                    <view class="arrow-right"></view>
                </navigator>
                <navigator class="items" url="news" hover-class="none">
                    <view class="iconfont  icon-lc-12 "></view>
                    <view class="body">
                        <view class="title grace-h5">分部预约</view>
                    </view>
                    <view class="arrow-right"></view>
                </navigator>
                <navigator class="items items-border" url="/pages/my/drivers_school" hover-class="none">
                    <view class="iconfont  icon-lc-5"></view>
                    <view class="body"><view class="title grace-h5">我的驾校</view></view>
                    <view class="arrow-right"></view>
                </navigator> -->
            </view>

			<!-- 总部权限 -->
			<view class="funs-menu grace-list" v-if="this.$api.qx([64],roleVal)">
				<navigator class="items items-border" url="/pages/generalschool/branchschool/list" hover-class="none">
					<view class="iconfont  icon-lc-68 "></view>
					<view class="body">
						<view class="title grace-h5">分部列表</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<!-- <navigator class="items items-border" url="Invitation" hover-class="none">
                    <view class="iconfont  icon-lc-63 "></view>
                    <view class="body">
                        <view class="title grace-h5">总部教练</view>
                    </view>
                    <view class="arrow-right"></view>
                </navigator>
                <navigator class="items" url="news" hover-class="none" >
                    <view class="iconfont  icon-lc-71 "></view>
                    <view class="body">
                        <view class="title grace-h5">总部学员</view>
                    </view>
                    <view class="arrow-right"></view>
                </navigator>
                <navigator class="items" url="news" hover-class="none" >
                    <view class="iconfont  icon-lc-12 "></view>
                    <view class="body">
                        <view class="title grace-h5">总部预约</view>
                    </view>
                    <view class="arrow-right"></view>
                </navigator>
                <navigator url="./drivers_school" hover-class="none" class="items">
                    <view class="icon">
                        <text class="iconfont icon-lc-5 colorzth" ></text>
                    </view>
                    <view class="text">我的驾校</view>
                </navigator> -->
			</view>

			<!-- 审核员 -->
			<view class="funs-menu grace-list" v-if="this.$api.qx([256],roleVal)">
				<navigator class="items items-border" url="examine" hover-class="none">
					<view class="iconfont icon-lc-4 "></view>
					<view class="body">
						<view class="title grace-h5">视频审核</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
			</view>
			
			<view class="funs-menu grace-list">
				<navigator class="items items-border" url="/pages/my/drivers_school" hover-class="none">
					<view class="iconfont  icon-lc-5"></view>
					<view class="body">
						<view class="title grace-h5">我的驾校</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="discount/verification_people_list" hover-class="none">
					<view class="iconfont icon-lc-6 "></view>
					<view class="body">
						<view class="title grace-h5">核销员列表</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="discount/discount_manage" hover-class="none">
					<view class="iconfont icon-coupon"></view>
					<view class="body">
						<view class="title grace-h5">优惠券管理</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
			</view>

			<view class=" grace-list">
				<navigator class="items items-border" url="question" hover-class="none">
					<view class="iconfont  icon-lc-11 "></view>
					<view class="body">
						<view class="title grace-h5">常见问题</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items items-border" url="opinion" hover-class="none">
					<view class="iconfont  icon-lc-37 "></view>
					<view class="body">
						<view class="title grace-h5">意见反馈</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items" url="about" hover-class="none">
					<view class="iconfont  icon-lc-10 "></view>
					<view class="body">
						<view class="title grace-h5">关于我们</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
				<navigator class="items" url="set" hover-class="none">
					<view class="iconfont  icon-lianchexiangmutubiao_shuchuban-"></view>
					<view class="body">
						<view class="title grace-h5">设置</view>
					</view>
					<view class="arrow-right"></view>
				</navigator>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				userinfo: '',
				all: '',
				coverurl: '',
				roleVal: 0
			};
		},
		onLoad() {
			let that = this;
			if (this.$api.storage('uid')) {
				that.load();
			}

		},
		onShow() {
			this.$nextTick(()=>{
				if(this.all){
					this.roleVal = this.all.roleVal || 0
				}else{
					this.roleVal =  0
				}
				console.log(this.roleVal);
			})
			if (this.$api.storage('uid')) {
				this.load();
			}
			if (this.$api.qx([16])) {
				uni.setTabBarItem({
					index: 2,
					text: '教学'
				})
			}
		},
		methods: {
			...mapMutations(['logout']),
			load() {
				let that = this;
				that.$api.request('My/Index/main', {
					uid: this.$api.storage('uid')
				}).then(res => {
					console.log(res);
					that.all = res.data;
					this.roleVal = this.all.roleVal
					let userinfo = that.$api.storage('userinfo');
					userinfo.roleVal = res.data.roleVal;
					that.$api.storage('userinfo', userinfo);
				});
			},
			Signin() {
				let that = this;
				if (that.all.userSign == 1) {
					return false;
				}
				that.$api.request('User/User/userSign', {}).then(res => {
					that.$api.Toast(res.msg);
					that.load();
				});
			},
		},
		onPullDownRefresh() {
			if (this.$api.storage('uid')) {
				this.load();
			}
			uni.stopPullDownRefresh();
		}
	};
</script>
<style>
	view {
		box-sizing: content-box;
	}

	.grace-ucenter-body {
		padding: 0 14rpx !important;
	}

	.grace-ucenter-header {
		width: 750rpx;
	}

	.grace-ucenter-face {
		width: 120rpx;
		height: 120rpx;
		margin-left: 17rpx;
		overflow: hidden;
		flex-shrink: 0;
	}

	.grace-ucenter-face-img {
		width: 110rpx;
		height: 110rpx;
		border-radius: 110rpx;
	}

	.grace-ucenter-name {
		display: block;
		width: 700rpx;
		margin-left: 30rpx;
		font-size: 36rpx;
		color: #ffffff;
		font-weight: bold;
	}

	.grace-box-banner {
		background: none;
	}

	.grace-box-banner view,
	navigator {
		border: none !important;
	}

	.status-badge {
		width: 168rpx;
		height: 65rpx;
		border-radius: 34rpx 0 0 34rpx;
		font-size: 32rpx;
		background: #2e3045;
		text-align: center;
	}

	.user-desc {
		margin: 0 20rpx 20rpx 35rpx;
		font-size: 28rpx;
		color: #b3b3bb;
		line-height: 26px;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.follow-data-line1 {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		line-height: 40rpx;
		text-align: center;
	}

	.follow-data-line2 {
		font-size: 24rpx;
		color: #b3b3bb;
		line-height: 24rpx;
		text-align: center;
		margin-top: 20rpx;
	}

	.grace-ucenter-hbtn {
		margin: 30rpx;
		background: linear-gradient(45deg, #ffd138, #ff00c9);
		color: #ffffff;
		height: 88rpx;
		border-radius: 60rpx;
	}

	.grace-ucenter-hbtn-text {
		font-size: 38rpx;
		color: #ffffff;
		margin-right: 20rpx;
	}

	.grace-ucenter-funs {
		margin-bottom: 50rpx;
		background-color: #212438;
		padding: 10rpx 25rpx;
		border-radius: 8rpx;
	}

	.grace-ucenter-logoff {
		margin-top: 10rpx;
	}

	.grace-ucenter-logoff-text {
		margin: 0 10rpx;
		line-height: 80rpx;
		color: #999999;
		font-size: 28rpx;
	}

	.funs-menu {
		margin-bottom: 50rpx;
		border-bottom: 20rpx solid #24263a;
	}

	.grace-list>.items {
		height: 96rpx;
	}

	.grace-list>.items>.body {
		border-bottom: 0;
	}

	.grace-list>.items>.body>.title {
		font-size: 30rpx;
	}

	.items-border {
		border-bottom: 1rpx solid #24263a;
	}

	.grace-list .items .arrow-right:before {
		content: '\E601';
		color: #b3b3bb;
	}

	/* .grace-body2 {padding-left: 10rpx;padding-right: 12rpx;} */
	.grace-grids .text {
		font-size: 30rpx;
	}

	.grace-body2 .iconfont {
		margin-left: 26rpx;
		font-size: 37rpx;
	}
</style>
