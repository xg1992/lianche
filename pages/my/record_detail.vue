<template>
	<view>
		<text class="colorb3 pd15">我的教练</text>
		<view class="user_box h_center jc_sb" @tap="tohome">
			<image :src="all.avatar?$realSrc(all.avatar):'/static/tx.png'" style="width: 96rpx;height: 96rpx;border-radius: 50%;display: block;margin-right:36rpx;"></image>
			<view class="f_grow">
				<view>{{all.nickname}}</view>
				<view class="colorb3 mgto26">{{all.mobile}}</view>
			</view>
		</view>
		<view class="mp15 record_tw bg2e radius16">
			<view class="jc_sb h_center">
				<view><text class="colorb3">进度：</text>{{ all.speed|speed}}</view>
				<text style="color:#F6A704">{{ all|recordStatus }}</text>
			</view>
			<view class="mgto26 line"><text class="colorb3">时间：</text>{{all.day}}（{{ all.period|periodText }}）</view>
			<view class="mgto26" @click="openadd(all.lat,all.lng)"><text class="colorb3">地点：</text><text>{{all.name}}</text><text
				 class="iconfont icon-lc-21 colorb3 pdz10"></text></view>
			<view class="bg2e form" v-if="all.status==3">
				<text class="colorb3">心得：</text>
				<view class=" posre mgto26">
					<textarea placeholder="写出你的练车心得，让教练知道你的想法" class="textarea" placeholder-style='color:#494C6A' maxlength="200"
					 @input='textarea' :value='all.comment' />
					<view class="maxtext"><text style="color:#494C6A;">{{textlen}}/200</text><text class="bc_btn" @click="sub">保存</text></view>
				</view>
				<view class="mgto26 h_center f_wrap" @tap="record">
					<view class="upimgbox" style="color:#494C6A">
						<text class="iconfont icon-lc-4" ></text>
						<text class="font24 " >拍摄短视频</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="qxbtn center" v-if="all.status==1" @click="cancelment">取消预约</view>
		<view style="clear:both"></view>
		<view class="font26 pd15" style="color:#FF6562;text-align: right;"  v-if="all.status==1">
			如果取消预约，请先通知，预约管理员！
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const plug=uni.requireNativePlugin("Html5App-CameraView");
	const HsShortVideo = uni.requireNativePlugin("Hs-ShortVideo");
	import { requestAndroidPermission,gotoAppPermissionSetting } from "@/common/permission.js"
	// #endif
	export default {
		data() {
			return {
				all:'',
				textlen:0,
				orderno:''
			}
		},
		filters:{
			recordStatus(data){
				let now = Date.now()
				let s = data.day + ' ' + data.start_time
				let e = data.day + ' ' + data.end_time
				s = s.replace(/\-/g, '/')
				e = e.replace(/\-/g, '/')
				let start = new Date(s).getTime()
				let end = new Date(e).getTime()
				switch(data.status){
					case -2:
					return '已取消'
					break
					case -1:
					return '取消中'
					break
					case 1:
					if(now<start) return '未开始'
					if(start<now<end) return '进行中'
					break
					case 2:
					return '进行中'
					break
					case 3:
					return '待笔记'
					break
					case 4:
					return '已完成'
					break
				}
			},
			periodText:function(period){
				period = parseInt(period)
				switch(period){
					case 1:
					return '上午'
					break
					case 2:
					return '下午'
					break
					case 3:
					return '夜晚'
					break
				}
			}
		},
		onLoad(options) {
			this.orderno = options.orderno
			this.load()
		},
		methods: {
			load(){
				let that=this
				that.$api.request('Train/Appointment/getInfo', {orderno:this.orderno}).then(res => {
					that.all=res.data
					if(that.all){
						that.value=that.all.comment;
						that.textlen=that.value.length
					}
				})
			},
			sub(){
				let that=this
				if(this.textlen<8){that.$api.Toast('不能少于8字');return false;}
				that.$api.request('Train/Appointment/updateOrder', {orderno:that.orderno,comment:this.value}).then(res => {
					that.$api.Toast(res.msg)
					setTimeout(()=>{
						that.load()
					},1500)
				})
			},
			cancelment(){
				let that=this
				uni.showModal({
				    title: '提示',
				    content: '确认取消该预约吗?',
				    success: function (res) {
				        if (res.confirm) {
				            that.$api.request('Train/Appointment/cancelOrder', {orderno:that.orderno}).then(res => {
				            	// console.log(res)
				            	that.$api.Toast(res.msg)
								setTimeout(()=>{
									that.load()
								},1500)
				            })
				        }
				    }
				});
				
			},
			textarea(e){
				let value=e.detail.value
				this.textlen=value.length
				this.value=e.detail.value
			},
			openadd(lat,lng){
				console.log(lat,lng)
				uni.openLocation({
				    latitude: Number(lat),
				    longitude: Number(lng),
				    success: function () {
				        console.log('success');
				    }
				});
			},
			tovideo(uid,videoid){
				// console.log(uid,videoid)
				uni.navigateTo({
					url: '/pages/video/video?act=Video/Works/videoByIdsShow&uid='+uid+'&ids='+videoid,});
			},
			//去用户主页
			tohome() {
				console.log(this.all);
				const uid = this.all.coach_id
				if (uid == uni.getStorageSync('uid')) {
					uni.switchTab({ url: '/pages/my/my' });
					return false;
				}
				uni.navigateTo({
					url: '/pages/homepage/homepage?uid=' + uid
				});
			},
			record(){
				const _this=this;
				if(_this.$api.platform == 'ios'){
					plug.open({"setMaxduration":30,"SpeedColor":"#3eafff","setFeatures":2,"setTip":'点击拍摄'},res=>{
										let result={localVoideoPath:res.mp4,address:'',cover:res.image}
					   //如果拍摄端取消了，就不做任何处理
					   if(res.result=="success") {
					       uni.navigateTo({
					            url: '/pages/release/release?result='+JSON.stringify(result)
					       });
					   }
					});
				}else{
					console.log('HsShortVideo')
					const C = requestAndroidPermission('android.permission.CAMERA')
					const A = requestAndroidPermission('android.permission.RECORD_AUDIO')
					const S = requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
					if(C&&A&&S){
						console.log('true')
						HsShortVideo.startRecored({
							"maxDuration": 60,
							"minDuration":5,
							"serverUrl": "https://lianche.haoshuninfo.com",
							"token": _this.$store.getters.token,
							"camera":"back",
							"ptdata":""
						}, res => {
							let result = res
							if (typeof result == "string") {
								result = JSON.parse(result)
							}
							console.log(result)
							let video={localVoideoPath:'file://'+result.video.videoPath,address:'',cover:'file://'+result.video.cover}
							uni.navigateTo({
							     url: '/pages/release/release?result='+JSON.stringify(video)
							});
						})
					}else{
						console.log('false')
						uni.showModal({
						    title: '提示',
						    content:"请允许APP使用摄像头、录制音频、存储文件的权限",
							confirmText:'去打开',
						    success: function (res) {
						        if (res.confirm) {
						            gotoAppPermissionSetting()
						        }
						    }
						});
					}
				}
			}
		}
	}
</script>

<style>
	.user_box{margin: 30rpx;padding: 30rpx 50rpx;box-sizing: border-box;background-color: #2E3045;border-radius:16rpx;}
	.record_tw{display: flex; flex-direction: column;padding: 50rpx;}
	.bg2e{background-color: #2E3045;}
	.form{
		padding-top: 30rpx;
		margin-top: 47rpx;
		border-top: 1rpx solid #191C2F;
	}
	.textarea{padding:51rpx 25rpx ;border-radius:8rpx;font-size: 30rpx;width: 100%;height: 452rpx;box-sizing: border-box;background-color: #24263A;}
	.upimgbox{display: flex;flex-direction: column;align-items: center;justify-content: center;width: 160rpx;height: 160rpx;background:#24263A;border-radius:8rpx;margin: 30rpx 0;}
	.upimgbox .iconfont{font-size: 50rpx;color:#494C6A;margin-bottom: 21rpx;}
	.btn{width: 90%;height: 88rpx;background-color: #3A3C55;border-radius: 16rpx;font-size: 34rpx;color: #F7F6F5;margin: 20rpx auto;}
	.maxtext{position: absolute;bottom:40rpx;right:40rpx;z-index: 99;}
	.bc_btn{padding: 12rpx 37rpx;font-size: 26rpx;color:#B3B3BB;border-radius:4rpx;background-color: #2E3045;margin-left: 25rpx;}
	.qxbtn{width:208rpx;height:64rpx;background:#2E3045;border-radius:8rpx;color:#B3B3BB;float: right;margin:40rpx 30rpx;}
</style>
