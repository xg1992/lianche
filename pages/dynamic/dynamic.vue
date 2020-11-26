<template>
    <view>
        <view class="dynamic-box-list" v-for="(item, idx) in list" :key="idx" v-if="list&&list.length>0">
            <view class="h_center jc_sb">
                <navigator hover-class="none" :url="'../homepage/homepage?uid=' + item.uid" class="h_center">
                    <view class="posre" style="margin-right: 25rpx;">
                        <image :src="$realSrc(item.avatar) ? $realSrc(item.avatar) : '/static/tx.png'" style="width: 96rpx;height:96rpx;border-radius: 50%;"></image>
                        <text class="coach_icon" v-if="item.role_val & 16">教练</text>
                        <text class="student_icon" v-if="item.role_val & 8">学员</text>
                    </view>
                    <view>
                        <text>{{ item.nickname }}\n</text>
                        <text class="colorb3 font26 mgto10">{{ date.fromTimer(item.create_time) }}</text>
                    </view>
                </navigator>
                <!-- <view class=" colorb3 font26 mgto10">{{ date.fromTimer(item.create_time) }}</view> -->
            </view>
            <view class="grace-nowrap" style="line-height: 45rpx;">
                <!-- <text class="colorzt">#视频介绍</text> -->
                <text class="video-title">{{ item.title }}</text>
            </view>
            <view class="dynamic-box">
                <!-- <video id="myVideo" :src="item.video" enable-danmu danmu-btn controls></video> -->
                <image :src="$realSrc(item.cover)" mode="aspectFill" @click="tovideo(item.uid, item.videoId)"></image>
            </view>
            <!-- <view class="h_center">
				<view class="h_center mgr84">
					<text class="iconfont icon-lc-20"  style="font-size: 54rpx;margin-right: 16rpx;"></text>
					<text>{{item.zans}}</text>
				</view>
				<view class="h_center mgr84">
					<text class="iconfont icon-lc-15" style="font-size: 54rpx;margin-right: 16rpx;"></text>
					<text>{{item.talks}}</text>
				</view>
				<view class="h_center mgr84">
					<text class="iconfont icon-lc-28" style="font-size: 54rpx;margin-right: 16rpx;"></text>
					<text>{{item.shares}}</text>
				</view>
			</view> -->
        </view>
		<list-empty v-if="!userInfo" :top="200" msg="前往登录,获取关注动态" img="/static/images/dl.png" button btn-text="登录"
		 @btnCallback="goLogin" :img-width="540"></list-empty>
		<list-empty v-if="list == '' && userInfo" :top="200" :msg="msg"></list-empty>
    </view>
</template>

<script>
import date from '../../graceUI/jsTools/date.js';
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            date,
            page: 1,
            list: '',
            login: true,
            msg: '',
        };
    },
	computed:{
		...mapGetters(['userInfo'])
	},
    onLoad() {
        if (this.userInfo) {
            this.load();
        }
    },
    onShow() {
        if (this.list == '' && this.userInfo) {
            this.load();
        }
        if (!this.$api.storage('token')) {
            this.list = '';
            this.login = true;
        }
		if(this.$api.qx([16])){
			uni.setTabBarItem({
			  index: 2,
			  text: '教学'
			})
		}
    },
    methods: {
        load() {
            let that = this;
            //如果未登录服务端返回13，会自动跳转到登录页
            that.$api.request('User/Dynamic/getList', {}).then(res => {
                that.msg = res.msg;
                that.login = false;
                that.list = res.data;
            });
        },
        tovideo(uid, videoid) {
            uni.navigateTo({ url: '/pages/video/video?act=Video/Works/videoByIdsShow&uid=' + uid + '&ids=' + videoid });
        },
		goLogin(){
			uni.navigateTo({
				url:'/pages/login/login'
			})
		},
    },
    onReachBottom() {
        let that = this;
        that.$api.request('User/Dynamic/getList', { page: this.page + 1 }, 'post', false).then(res => {
            that.list = that.list.concat(res.data);
            if (res.data) {
                that.page = that.page + 1;
            } else {
                that.$api.Toast('暂无更多数据');
            }
        });
    },
    onPullDownRefresh() {
        this.page = 1;
        this.load();
        uni.stopPullDownRefresh();
    }
};
</script>

<style>
.coach_icon {
    position: absolute;
    bottom: 0;
    border-radius: 12rpx;
    background-color: #ff6562;
    font-size: 16rpx;
    left: 0;
    right: 0;
    margin: auto;
    display: block;
    width: 56rpx;
    height: 24rpx;
    line-height: 24rpx;
    text-align: center;
    padding: 4rpx 0;
    box-sizing: border-box;
}
.student_icon {
    position: absolute;
    bottom: 0;
    border-radius: 12rpx;
    background-color: #6982fa;
    font-size: 16rpx;
    left: 0;
    right: 0;
    margin: auto;
    display: block;
    width: 56rpx;
    height: 24rpx;
    line-height: 24rpx;
    text-align: center;
    padding: 4rpx 0;
    box-sizing: border-;
}
.video-title{
    width: 690rpx;
    font-size: 28rpx;
    color: #b3b3bb;
    line-height: 26px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.dynamic-box-list{
    margin-bottom: 60rpx;
	padding: 0 30rpx;
}
.dynamic-box {
    padding-bottom: 18rpx;
    border-bottom: 1px solid #191926;
}
.dynamic-box video, image {
    width: 466rpx;
    height: 643rpx;
    border-radius: 8rpx;
}
.mgr84 {
    margin-right: 84rpx;
}
.btn {
    width: 70%;
    margin: auto;
    height: 80rpx;
    background-color: #f6a704;
    border-radius: 48rpx;
    color: white;
}
</style>
