<template>
		<!-- 页面主体 -->
		<view class="grace-body">
				<graceDialog title="个人信息保护指引" :show="dialogShow" :isCloseBtn="false" width="620rpx" titleColor="#333333">
					<scroll-view class="xy-content" slot="content" scroll-y>
						<view style="color: #000000;">请充分阅读并理解</view>
                        <text url="./yonghufuwuxieyi" style="color: #e70073;" @tap="yonghufuwuxieyi">《用户服务协议》</text>
                        <text style="color: #000000;">和</text>
                        <text url="./yinsizhengce" style="color: #e70073;" @tap="yinsizhengce">《隐私政策》</text>
                        <view style="color: #000000;">
                            <text>
                                1.在仅浏览时，我们可能会申请系统设备权限收集设备信息、日志信息，用于信息推送和安全风控，并申请存储权限，用于下载及缓存相关文件。
                                2.我们可能会申请位置权限，用于帮助你在发布的信息中展示位置或丰富信息推荐维度。城市位置无需使用位置权限，仅通过ip地址确定“同城”中所展示的城市及相关信息，不会收集精确位置信息。
                                3.为了帮你发现更多好友，我们可能会申请通讯录权限。如果你不希望被推荐给好友，你可以在“我设置-隐私设置”中随时关闭。
                                4.为帮助你在APP中拨打投诉电话或其他咨询热线，我们可能会申请拨打电话权限，该权限不会收集隐私信息，且仅在你使用前述功能时使用。
                                5.上述权限以及摄像头、麦克风、相册、存储空间、GPS、日历等敏感权限均不会默认或强制开启收集信息。
                            </text>
                        </view>
					</scroll-view>
					<view slot="btns" class="grace-space-between">
						<text class="grace-dialog-buttons" style="background-color:#e6e6e6;" @tap="notAgreement">不同意</text>
						<text class="grace-dialog-buttons grace-bg-blue" @tap="confirm">我同意</text>
					</view>
				</graceDialog>
			</view>
		</view>
</template>
<script>
import graceDialog from '../../graceUI/components/graceDialog.vue';
var graceJS = require('@/Grace.JS/grace.js');
import { checkUpdate } from "@/common/update.js"
export default {
    data() {
    	return {
			dialogShow : false
		}
    },
	onLoad:function(){
		// 根据用户是否已经同意授权决定是否弹出对话框
		// 原理 利用本地缓存记录一个变量记录客户是否已经同意协议
		var val = graceJS.getStorage('SigningAgreement');
		this.showDialog();
        //if(!val){this.showDialog();}
	},
	onBackPress(e) {
		if (e.from == 'backbutton') {
			return true
		}
	},
	methods:{
		showDialog : function(){
			this.dialogShow = true;
		},
		notAgreement : function(){
			plus.runtime.quit()
		},
		closeDialog : async function(){
			this.dialogShow = false;
			await checkUpdate()
            uni.navigateBack({delta: 1});
		},
		confirm : function(){
			//记录客户已经同意
			uni.setStorageSync('isAgreement',true)
			// 关闭弹出框
			this.closeDialog();
		},
        //隐私政策
        yinsizhengce: function() {
            uni.navigateTo({
                url: './yinsizhengce'
            });
        },
        //用户服务协议
        yonghufuwuxieyi: function(){
            uni.navigateTo({
                url: './yonghufuwuxieyi'
            });
        }
	},
	components:{
		graceDialog
	}
}
</script>
<style scoped>
	page {
		background: transparent!important;
	}
.xy-content{padding:10rpx 30rpx; background-color:#F6F6F6; line-height:50rpx; font-size:28rpx; height:800rpx; box-sizing:border-box;}
.grace-dialog-buttons{width:250rpx; border-radius:6rpx; height:78rpx; line-height:78rpx; text-align:center; margin:25rpx;}
</style>