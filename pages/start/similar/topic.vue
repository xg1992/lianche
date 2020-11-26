<template>
    <view>
        <view class="similar_nav t_center ">
            <image src="/static/topic_mc.png" class="similar_img" @tap="tohome(all.info.uid)"></image>
            <view class="">
                <view class="similar_title">{{ all.info.name }}</view>
                <view class="similar_author iconfont icon-arrow-right" @tap="tohome(all.info.uid)">{{ all.info.nickname }}</view>
                <view class="colorb3 font26" style="margin-top:17rpx;">{{ all.info.play_number }}次播放</view>
            </view>
        </view>
        <view class="h_center f_wrap">
            <view class="list_box" v-for="(item, idx) in list" :key="idx" @tap="tolook(item.videoId)">
                <image :src="$realSrc(item.cover)"></image>
                <view class="item_like">
                    <text class="iconfont icon-lc-18"></text>
                    {{ item.recommends }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            all: { info: { name: '话题名', uid: 0, nickname: '发布者', play_number: 0, use_number: 0 }, list: [] },
            list: '',
            page: 1
        };
    },
    onLoad(options) {
        this.topicId = options.id; //获取传入的话题id
        this.load();
    },
    methods: {
        load() {
            let that = this;
            that.$api.request('Search/Topics/allList', { topicsId: that.topicId, type: 1 }).then(res => {
                that.all = res.data;
                that.list = res.data.list;
            });
        },

        /**
         * 播放视频及列表
         * @param {int} currentVideoId 当前视频id
         * @param {array} videoList 当前视频列表
         */
        tolook(currentVideoId, videoList=[]) {
            // console.log(currentVideoId);
            if (currentVideoId > 0) {
                let that = this;
                uni.navigateTo({
                    url: '/pages/video/video?act=Search/Topics/allList&currentVideoId=' + currentVideoId + '&typeShow=1' + 
                         '&topicsId=' + this.topicId
                });
            }
        },

        //去用户主页
        tohome(authorUid) {
            if (authorUid > 0) {
                uni.navigateTo({ url: '/pages/homepage/homepage?uid=' + authorUid });
            }
        }
    },
    onReachBottom() {
        let that = this;
        that.$api
            .request('Search/Topics/allList', {
                page: that.page + 1,
                pagesize: 10,
                topicsId: that.topicId,
                type: 1
            })
            .then(res => {
                that.list = that.list.concat(res.data.list);
                if (res.data) {
                    that.page = that.page + 1;
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
.similar_nav {
    padding: 40rpx 30rpx;
}
.similar_img {
    display: block;
    width: 200rpx;
    height: 200rpx;
    margin-right: 30rpx;
}
.list_box {
    position: relative;
    width: 33.3%;
    height: 332rpx;
}
.list_box image {
    width: 100%;
    height: 100%;
}
.item_like {
    position: absolute;
    bottom: 28rpx;
    left: 19rpx;
    font-size: 22rpx;
}
.item_like .iconfont {
    font-size: 22rpx;
    padding-right: 9rpx;
}
.similar_title {
    margin-top: 20rpx;
    font-size: 36rpx;
    color: #e3e3e3;
}
.similar_author {
    margin-top: 20rpx;
    margin-bottom: 30rpx;
    font-size: 26rpx;
    color: #989898;
}
</style>
