<script src="https://cdn.bootcss.com/babel-polyfill/7.0.0-beta.49/polyfill.min.js"></script>
<script>
	// #ifdef APP-PLUS
	//const dcRichAlerts = uni.requireNativePlugin('LianCheShortVideo');
	const HsShortVideo = uni.requireNativePlugin("Hs-ShortVideo");
	import {
		requestAndroidPermission,
		gotoAppPermissionSetting
	} from "@/common/permission.js"
	// #endif
	import api from './common/api.js'
	import config from './config/index.js'
	import {
		clearAllVideoCache
	} from '@/common/common.js'
	import {
		checkUpdate
	} from '@/common/update.js'
	export default {
		globalData: {
			api: api,
			screenWidth: uni.getSystemInfoSync().screenWidth,
			screenHeight: uni.getSystemInfoSync().screenHeight,
		},
		onLaunch: async function(e) {
			console.log('App Launch')
			console.log(this.globalData);
			const that = this
			clearAllVideoCache({
				clearTimeout: true
			})
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁定屏幕
			const dom = weex.requireModule('dom');
			dom.addRule('fontFace', {
				'fontFamily': "graceiconfont",
				'src': "url('https://at.alicdn.com/t/font_823462_iibm712xod.ttf')"
			});
			uni.onTabBarMidButtonTap(function() {
				console.log('onTabBarMidButtonTap')
				let t = 60;
				if (!that.$api.storage('token')) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false
				}
				const _this = this;
				if (that.$api.platform == 'ios') {
					uni.$emit('pauseVideo')
					// 调起拍摄
					startRecored()
				} else {
					console.log('HsShortVideo')
					const CAMERA = requestAndroidPermission('android.permission.CAMERA')
					const RECORD_AUDIO = requestAndroidPermission('android.permission.RECORD_AUDIO')
					const WRITE_EXTERNAL_STORAGE = requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
					if (CAMERA && RECORD_AUDIO && WRITE_EXTERNAL_STORAGE) {
						// 调起拍摄
						startRecored()
					} else {
						console.log('false')
						uni.showModal({
							title: '提示',
							content: "请允许APP使用照相设备、录制音频、存储文件",
							success: function(res) {
								if (res.confirm) {
									gotoAppPermissionSetting()
								}
							}
						});
					}
				}

			})

			function startRecored() {
				let t = 60;
				HsShortVideo.startRecored({
					"maxDuration": t,
					"minDuration": 5,
					"serverUrl": "https://lianche.haoshuninfo.com",
					"token": that.$store.getters.token,
					"camera": "back",
					"setTip": `拍摄${t}秒`,
					"ptdata": ""
				}, res => {
					console.log(res)
					if (typeof res === 'string') {
						res = JSON.parse(res)
					}
					if (res.code && res.code === 1001) {
						console.log('放弃拍摄')
						return;
					}
					if (res.video) {
						let obj = res.video;
						let result = {
							localVoideoPath: 'file://' + obj.videoPath,
							address: obj.address || '',
							videoPath: 'file://' + obj.videoPath || '', //视频路径	String
							cover: 'file://' + obj.cover || '', //封面路径	String	
							duration: obj.duration || '', //视频时长,单位为秒,视频时长通常不会少于最短录制时间	int	
							width: obj.width || '', //视频分辨率宽度	int	
							height: obj.height || '', //视频分辨率高度	int	
							type: obj.type || '', //视频是拍摄还是导入的，1.拍摄 2.导入	int	
							length: obj.length || '', //视频文件大小，单位为字节	long
							lat: obj.lat,
							lon: obj.lon,
						}
						console.log(result);
						// 返还数据不存在对应字段的填空字符，不要保存为undefined，避免转为字符串时被忽略
						if (that.$api.platform == 'ios') {
							uni.navigateTo({
								url: '/pages/videoedit/index?result=' + JSON.stringify(result)
							});
						} else {
							uni.navigateTo({
								url: '/pages/release/release?result=' + JSON.stringify(result)
							});
						}

					}
				})
			}

			plus.device.getInfo({
				success: function(e) {
					that.$api.storage('uuid', e.uuid.split(',')[0])
				}
			});

			this.checkRead()
			// #endif
		},
		onShow: function() {
			// #ifdef APP-PLUS
			console.log('App Show')
			// 获取第三方跳转参数
			setTimeout(()=>{
				var args = plus.runtime.arguments;
				console.log('启动参数');
				console.log(args);
				if(args){
					try{
						let obj = JSON.parse(args)
						console.log(obj);
						let { path,openType } = obj
						if(path){
							switch(openType){
								case 'navigate':
								uni.navigateTo({
									url: path
								});
								break;
								case 'redirect':
								uni.redirectTo({
									url: path
								})
								break;
								case 'switchTab':
								uni.switchTab({
									url: path
								})
								break;
								case 'reLaunch':
								uni.reLaunch({
									url: path
								})
								break;
								default:
								uni.navigateTo({
									url: path
								});
								break;
							}
						}
					}catch(e){
						console.log('参数解析错误',e);
					}
				}
				plus.runtime.arguments = null;
				plus.runtime.arguments = '';
			},500)
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 检查是否阅读用户协议
			checkRead() {
				const isAgreement = uni.getStorageSync('isAgreement');
				if (!isAgreement) {
					uni.navigateTo({
						url: '/pages/subnvue/appxieyi'
					});
				} else {
					this.$nextTick(function() {
						checkUpdate()
					})
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
	@import "./graceUI/graceUI.css";
	@import "./graceUI/graceIcons.css";
	@import "./iconfont/iconfont.css";
	@import "./static/css/common.css";
	/* #endif */

	/* #ifdef APP-PLUS-NVUE */
	@import "./graceUI/graceWeex.css";

	.grace-icons {
		font-family: graceiconfont;
	}

	/* #endif */

	/* 描述2行 */
	.text-lines-2 {
		font-size: 24rpx;
		line-height: 30rpx;
		lines: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 描述3行 */
	.text-lines-3 {
		font-size: 24rpx;
		line-height: 30rpx;
		lines: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
