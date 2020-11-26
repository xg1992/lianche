<template>
    <view v-if="popupVisible">
    <!-- <view> -->
        <view class="mark" @tap="popClose"></view>
        <view>
            <scroll-view class="outView" scroll-y="true">
                <view class="content" style="display: flex;flex: 1;flex-direction: column;">
                    <text class="title">{{ uptext }}</text>
                    <text class="content-list">{{ updateContent }}</text>
                </view>
                <view @tap="download" class="progress">
                    <graceProgressButton :buttonText="buttonText" :val="progress" background="#f66e13" color="#fff" borderRadius="16rpx"></graceProgressButton>
                </view>
                <image src="/static/gb-kong.png" class="close-btn" @tap="popClose"></image>
            </scroll-view>
        </view>
    </view>
</template>
<script>
import graceProgressButton from '@/graceUI/weexComponents/graceProgressButton.nvue';
import config from '../../config/index.js'
import { request } from '@/common/api.js'
export default {
    data() {
        return {
            popupVisible: false,
            progress: 0,
            buttonText: '安装新版本',
            fileUrl: '',
            updateObjec: null,
            updateContent: '更新已知问题',
            uptext: '当前已是最新版',
            isDownload: false, //记录是否已经在下载了
            pf: 0 //1:android, 2:ios, 3:其他
        };
    },
    components: {
        graceProgressButton
    },
    onLoad: function() {
        this.load();
    },
    methods: {
        popShow() {
            this.load();
        },
        popClose() {
            this.popupVisible = false;
        },
        load() {
            let that = this;
            const res = uni.getSystemInfoSync();
            that.pf = res.platform == 'android' ? 1 : res.platform == 'ios' ? 2 : 3; // 1:android, 2:ios, 3:其他
            request(
                    'Main/Index/appStart',
                    {
                        platform: that.pf,
                        deviceBrand: res.brand,
                        deviceModel: res.model,
                        systemVersion: res.system,
                        appVersion: plus.runtime.version,
                        deviceInfo: JSON.stringify(res)
                    },
                    'POST',
                    false
                )
                .then(res => {
                    that.updateObjec = res.data.appUpdate;
                    that.updateContent = that.updateObjec.msg;
                    if (plus.runtime.version >= that.updateObjec.version) {
                        this.popupVisible = false;
                        that.uptext = '当前已是最新版';
                    } else {
                        this.popupVisible = true;
                        that.uptext = '有新的版本';
                    }
                });
        },
        //更新下载
        download: function() {
            if (this.pf == 1) {
                this.androidDown();
            } else {
                this.iosDown();
            }
        },

        //android下载
        androidDown() {
            // 防止多次点击，这里做个处理
            if (this.isDownload) {
                return;
            }
            let that = this;
            this.isDownload = true;
            setTimeout(function() {
                that.isDownload = false;
            }, 15000);

            // 根据进度判断要做什么
            // 0 下载
            if (that.progress == 0 && that.updateObjec) {
                that.buttonText = '正在安装';
                const downloadTask = uni.downloadFile({
                    url: that.updateObjec.pkgUrl,
                    success: res => {
                        if (res.statusCode === 200) {
                            that.progress = 100;
                            uni.showToast({
                                title: '新版本下载成功，开始安装',
                                icon: 'none'
                            });
                            plus.runtime.install(res.tempFilePath);
                        }
                    }
                });
                downloadTask.onProgressUpdate(res => {
                    that.progress = res.progress;
                });
            } else {
                uni.showToast({ title: '暂无新版本', icon: 'none' });
            }
        },

        //ios下载
        iosDown() {
            plus.runtime.openURL('itms-apps://' + 'itunes.apple.com/cn/app/wechat/id414478124?mt=8');
        }
    }
};
</script>
<style>
.mark {
    background-color: #000;
    opacity: 0.6;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
}
.outView {
    background-color: #f7f7f7;
    width: 600rpx;
    height: 700rpx;
    left: 75rpx;
    top: 260rpx;
    overflow: hidden;
    position: fixed;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 12rpx;
    border-top-right-radius: 12rpx;
    border-bottom-right-radius: 12rpx;
    border-bottom-left-radius: 12rpx;
    z-index: 1001;
}
.content {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */

    /* display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center; */
    justify-content: flex-start;
    padding: 0 28rpx;
}
.title {
    text-align: center;
    font-size: 42rpx;
    color: #191c2f;
    margin-top: 16px;
    margin-bottom: 16px;
    padding-bottom: 12rpx;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #ff7577;
}
.content-list {
    padding-left: 10rpx;
    font-size: 28rpx;
    color: #191c2f;
    line-height: 46rpx;
}
.progress {
    width: 540rpx;
    margin-bottom: 40rpx;
}
.close-btn {
    position: absolute;
    width: 48rpx;
    height: 48rpx;
    right: 20rpx;
    top: 32rpx;
}
</style>
