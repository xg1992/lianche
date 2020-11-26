<template>
    <gracePage :customHeader="false">
        <view slot="gBody" class="grace-body" style="padding-bottom:150rpx;">
            <view class="grace-title grace-h4" style="margin-top:50px;">{{ uptext }}</view>
            <view class="grace-text">
                <text>{{ updateContent.msg != "" ? updateContent.msg : '' }}</text>
            </view> 
        </view>
        <view slot="gFooter" class="concerns-footer" @tap="download" v-if="updateContent">
            <graceProgressButton :buttonText="buttonText" :val="progress" background="#F6A704" color="#fff" borderRadius="16rpx"></graceProgressButton>
        </view>
    </gracePage>
</template>
<script>
import gracePage from '../../graceUI/components/gracePage.vue';
import graceProgressButton from '../../graceUI/components/graceProgressButton.vue';
import config from '../../config/index.js'
export default {
    data() {
        return {
            progress: 0,
            buttonText: '安装新版本',
            fileUrl: '',
            updateContent: {msg:"", version:""},
            uptext: '当前已是最新版',
            isDownload: false, //记录是否已经在下载了
            pf: 0 //1:android, 2:ios, 3:其他
        };
    },
    components: {
        gracePage,
        graceProgressButton
    },
    onLoad: function() {
        let that = this;
        const res = uni.getSystemInfoSync();
        that.$api.storage('SystemInfo', res);
        that.pf = res.platform == 'android' ? 1 : res.platform == 'ios' ? 2 : 3; // 1:android, 2:ios, 3:其他
        that.$api
            .request(
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
                that.updateContent = res.data.appUpdate;
                if (plus.runtime.version == that.updateContent.version) {
                    that.uptext = '当前已是最新版';
                } else {
                    that.uptext = '有新的版本';
                    that.updateContent.msg = (typeof that.updateContent.msg == "undefined") ? '' : that.updateContent.msg;
                }
            });
    },
    methods: {
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
            if (that.progress == 0 && that.updateContent) {
                that.buttonText = '正在安装';
                const downloadTask = uni.downloadFile({
                    url: that.updateContent.pkgUrl,
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
            plus.runtime.openURL('itms-apps://' + 'itunes.apple.com/cn/app/wechat/id1513086687');
        }
    }
};
</script>
<style>
.concerns-footer {
    padding: 30rpx 20rpx;
    margin-bottom: 40rpx;
}
#myVideo {
    width: 100%;
}
</style>
